import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Spot } from '../../models/spot';
import { Hashtag } from '../../models/hashtag';
import { Observable } from 'rxjs/Observable';

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
      let m, hashtagList =[];
      while ((m = rx.exec(message)) !== null) {
        if (m[1]) hashtagList.push(m[1]);
     }

     hashtagList.forEach(hashtag =>{
      const searchHashtag = this.searchHashtag(hashtag);
      
      const subscribe = searchHashtag.subscribe(snapshots=>{
        if(snapshots.length > 0){
          snapshots.forEach(snapshot => {
            let hastag = new Hashtag(snapshot.val().name,snapshot.val().spotKeyList);
            hastag.spotKeyList.push(spot.key);
            const hashtags = this.db.list('/hashtags/');
            hashtags.update(snapshot.key,hastag);
            subscribe.unsubscribe();
          });
        }else{
          let spotKeyList = [];
          spotKeyList.push(spot.key);
          let hastag = new Hashtag(hashtag,spotKeyList);
          const hashtags = this.db.list('/hashtags');
          hashtags.push(hastag);
          subscribe.unsubscribe();
        }

      })
     })


    })
  }

  getSpotList(batch, lastDate): Observable<any>{
    let query =  {
      orderByChild: 'dateUpdate',
      limitToFirst: batch
    }

    if (lastDate) query['startAt'] = lastDate;

    return this.db.list('/spots', {
      query
    }).map((items) => {
      return items.map(item => {
        item.user = this.db.object(`/users/${item.userUid}`);
        return item;
      })
    })
  }


   fetchSpot(hashtagName:string){

    let spotKeyList = [];
    const searchHashtag = this.searchHashtag(hashtagName);

    const subscribe = searchHashtag.subscribe(snapshots=>{
      if(snapshots.length > 0){
        snapshots.forEach(snapshot => {
          if(snapshot.val().spotKeyList.length > 0){
            snapshot.val().spotKeyList.forEach(key =>{
              spotKeyList.push(key);
            })
          }
        });
        spotKeyList.map(key =>{
          const spots = this.db.object('/spots/'+key);
          spots.subscribe(snapshot=>{
              console.log(snapshot);
          })
        });
      }
      subscribe.unsubscribe();
    })
   }

  fetchHashtag(name:string): FirebaseListObservable<any[]> {
    return this.db.list('/hashtags', {
      query: {
        orderByChild: 'name',
        startAt: { value: name},
        endAt: { value: name+"\uf8ff"}
      }
    });
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
