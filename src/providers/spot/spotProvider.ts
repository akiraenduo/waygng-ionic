import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList,AngularFireObject } from 'angularfire2/database';
import { Spot } from '../../models/spot';
import { Hashtag } from '../../models/hashtag';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash'

/*
  Generated class for the SpotProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SpotProvider {

  constructor(public http: Http,
              public db: AngularFireDatabase) {

  }




  addSpot(spot:Spot){
    let message = spot.message;
    spot.dateUpdate = -spot.dateUpdate ;
    const spots = this.db.list('/spots');
    spots.push(spot).then(spot =>{
      let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
      let m, hashtagList:string[] =[];
      while ((m = rx.exec(message)) !== null) {
        if (m[1]) hashtagList.push(m[1]);
     }

     hashtagList.forEach(hashtag =>{
      const searchHashtag = this.searchHashtag(hashtag);
      
      const subscribe = searchHashtag.snapshotChanges().subscribe(snapshots=>{
        if(snapshots.length > 0){
          snapshots.forEach(snapshot => {
            let hastag = new Hashtag(snapshot.payload.val().name,snapshot.payload.val().tag,snapshot.payload.val().spotKeyList);
            hastag.spotKeyList.push(spot.key);
            const hashtags = this.db.list('/hashtags/');
            hashtags.update(snapshot.key,hastag);
            subscribe.unsubscribe();
          });
        }else{
          let spotKeyList = [];
          spotKeyList.push(spot.key);
          let hastag = new Hashtag(hashtag.toLowerCase(),hashtag,spotKeyList);
          const hashtags = this.db.list('/hashtags');
          hashtags.push(hastag);
          subscribe.unsubscribe();
        }

      })
     })


    })
  }

  getSpot(key:string):AngularFireObject<any>{
    return this.db.object('/spots/'+key);
  }

  getSpotList(batch, lastDate): AngularFireList<any>{
    if(lastDate){
      return this.db.list('/spots', ref => ref.orderByChild('dateUpdate').limitToFirst(batch).startAt(lastDate));
    }else{
      return this.db.list('/spots', ref => ref.orderByChild('dateUpdate').limitToFirst(batch));
    }

  }

  fetchSpots(hashtagKey:string, lastKey:string, batch:number):Observable<any>{
    return this.db.object('/hashtags/'+hashtagKey).snapshotChanges().do((item) => { 
      console.log(item);
     /* item.spots = [];
      let spotKeyList = item.spotKeyList.reverse();
      let index = 0;
      if(lastKey){
        index = _.findIndex(spotKeyList, function(key) { return key == lastKey });
      }
      let endIndex = index + batch;
      spotKeyList = _.slice(spotKeyList, index, endIndex);
      return spotKeyList.map(key => {
        item.spots.push(this.db.object("/spots/"+key));
          return item;
        })*/
      })
   }

  fetchHashtag(name:string): AngularFireList<any> {
      return this.db.list('/hashtags', ref => 
        ref.orderByChild('name').limitToFirst(4).startAt(name).endAt(name+"\uf8ff")
      );
  }

  incrementLikes(spotUid:string, spotUserUid:string, userUid:string){
    const items = this.db.object('/spots/'+spotUid+'/likes/'+spotUserUid);
    let like = {};
    like[userUid] = true;
    items.update(like);
  }

   private searchHashtag(name): AngularFireList<any> {
    return this.db.list('/hashtags', ref => ref.orderByChild('name').equalTo(name));
  }

}
