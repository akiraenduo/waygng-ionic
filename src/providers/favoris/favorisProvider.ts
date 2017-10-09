import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase , AngularFireList} from 'angularfire2/database';

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

  getFavorisList(userUid): AngularFireList<any>{
   return this.db.list('/users/'+userUid+'/stations');
  }

  getFavoris(userUid, nomStation): AngularFireList<any> {
    return this.db.list('/users/'+userUid+'/stations', ref => ref.orderByChild('name').equalTo(nomStation));
   }

  addFavoris(userUid, nomStation){
    const items = this.db.list('/users/'+userUid+'/stations');
    items.push({name:nomStation});
  }

  removeFavoris(userUid, nomStation){


    const items = this.db.list('/users/'+userUid+'/stations', ref => ref.orderByChild('name').equalTo(nomStation));

    items.snapshotChanges().subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        items.remove(snapshot.key);
      });
    })

  }

}
