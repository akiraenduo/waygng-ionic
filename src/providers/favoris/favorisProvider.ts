import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Generated class for the FavorisProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavorisProvider {

  constructor(public http: Http,
              public db: AngularFireDatabase) {
  }

  getFavorisList(userUid): FirebaseListObservable<any>{
   return this.db.list('/users/'+userUid+'/stations');
  }

  getFavoris(userUid, nomStation): FirebaseListObservable<any> {
    return this.db.list('/users/'+userUid+'/stations',{ 
      query: {
        orderByChild: 'name',
        equalTo: nomStation 
      }
     });
   }

  addFavoris(userUid, nomStation){
    const items = this.db.list('/users/'+userUid+'/stations');
    items.push({name:nomStation});
  }

  removeFavoris(userUid, nomStation){
    const items = this.db.list('/users/'+userUid+'/stations', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'name',
        equalTo: nomStation
      }
    });
    const deleteSubscribe = items.subscribe(snapshots=>{
      snapshots.forEach(snapshot => {
        snapshot.ref.remove();
        deleteSubscribe.unsubscribe();
      });
    })
  }

}
