import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
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
              private afs: AngularFirestore) {

  }




  addSpot(spot:Spot){
    let message = spot.message;
    spot.dateUpdate = -spot.dateUpdate ;
    const spots = this.afs.collection('/spots');
    spot = Object.assign({}, spot);
    spots.add(spot).then(spot =>{
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
            const data = snapshot.payload.doc.data();
            const id = snapshot.payload.doc.id;
            let hastag = new Hashtag(data.name,data.tag,data.spotKeyList);
            hastag.spotKeyList.push(spot.id);
            const hashtags = this.afs.doc('/hashtags/'+id);
            hastag = Object.assign({}, hastag);
            hashtags.update(hastag);
            subscribe.unsubscribe();
          });
        }else{
          let spotKeyList = [];
          spotKeyList.push(spot.id);
          let hastag = new Hashtag(hashtag.toLowerCase(),hashtag,spotKeyList);
          const hashtags = this.afs.collection('/hashtags');
          hastag = Object.assign({}, hastag);
          hashtags.add(hastag);
          subscribe.unsubscribe();
        }

      })
     })


    })
  }

  getSpotsForCurrentUser(userUid:string): AngularFirestoreCollection<any>{
    return this.afs.collection('/spots', ref => ref.where('userUid', '==', userUid).orderBy('dateUpdate','asc'));
  }

  getSpot(key:string):AngularFirestoreDocument<any>{
    return this.afs.doc('/spots/'+key);
  }

  getSpotList(batch, lastDate): AngularFirestoreCollection<any>{
    if(lastDate){
      return this.afs.collection('/spots', ref => ref.orderBy('dateUpdate').limit(batch).startAt(lastDate));
    }else{
      return this.afs.collection('/spots', ref => ref.orderBy('dateUpdate').limit(batch));
    }

  }

  fetchSpots(hashtagKey:string, lastKey:string, batch:number):Observable<any>{
    return this.afs.doc('/hashtags/'+hashtagKey).valueChanges().do((item) => { 
      item["spots"] = [];
      let spotKeyList = item["spotKeyList"].reverse();
      let index = 0;
      if(lastKey){
        index = _.findIndex(spotKeyList, function(key) { return key == lastKey });
      }
      let endIndex = index + batch;
      spotKeyList = _.slice(spotKeyList, index, endIndex);
      return spotKeyList.map(key => {
          item["spots"].push({spot:this.afs.doc("/spots/"+key).valueChanges(),ref:this.afs.doc("/spots/"+key).ref});
          return item;
        })
      })
   }

  fetchHashtag(name:string): AngularFirestoreCollection<any> {
    return this.afs.collection('hashtags', ref => ref.orderBy('name').limit(4).startAt(name).endAt(name+"\uf8ff"));
  }

  incrementLikes(spotUid:string, spot){
    const item = this.afs.doc('/spots/'+spotUid);
    item.update(spot); 
  }

   private searchHashtag(name): AngularFirestoreCollection<any> {
    return this.afs.collection('/hashtags', ref => ref.where('name', '==', name));
  }

  removeSpot(spotUid:string){
    this.afs.doc('/spots/'+spotUid).delete();
  }

}
