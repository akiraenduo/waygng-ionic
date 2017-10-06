import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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
      
      const subscribe = searchHashtag.subscribe(snapshots=>{
        if(snapshots.length > 0){
          snapshots.forEach(snapshot => {
            let hastag = new Hashtag(snapshot.val().name,snapshot.val().tag,snapshot.val().spotKeyList);
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

  getSpot(key:string):Observable<any>{
    return this.db.object('/spots/'+key);
  }

  getSpotList(batch, lastDate): Observable<any>{
    let query =  {
      orderByChild: 'dateUpdate',
      limitToFirst: batch
    }

    if (lastDate) query['startAt'] = lastDate;

    return this.db.list('/spots', {
      query
    });
  }

  fetchSpots(hashtagKey:string, lastKey:string, batch:number):Observable<any>{
    return this.db.object('/hashtags/'+hashtagKey).do((item) => { 
      item.spots = [];
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
        })
      })
   }

  fetchHashtag(name:string): Observable<any[]> {
      return this.db.list('/hashtags', {
        query: {
          orderByChild: 'name',
          limitToFirst: 4,
          startAt: { value: name},
          endAt: { value: name+"\uf8ff"}
        }
      });
  }

  incrementLikes(spotUid:string, userUid:string){
    const items = this.db.object('/spots/'+spotUid+'/likes/'+userUid);
    items.set(true);
  }

   private searchHashtag(name): FirebaseListObservable<any[]> {
    return this.db.list('/hashtags', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'name',
        equalTo: name
      }
    });
  }

}
