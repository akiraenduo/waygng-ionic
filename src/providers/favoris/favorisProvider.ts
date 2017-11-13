import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Station } from '../../models/station';

/*
  Generated class for the FavorisProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavorisProvider {

  constructor(public http: Http,
              private afs: AngularFirestore) {
  }

  getFavorisList(userUid): AngularFirestoreCollection<any>{
   return this.afs.collection('/users/'+userUid+'/stations');
  }

  getFavoris(userUid, nomStation): AngularFirestoreCollection<any> {
    return this.afs.collection('/users/'+userUid+'/stations', ref => ref.where('name', '==', nomStation));
  }

  addFavoris(userUid, station:Station){
    station.latLong = null;
    const items = this.afs.collection('/users/'+userUid+'/stations/');
    return items.add(station);
  }

  removeFavoris(userUid, nomStation){

    const itemsCollection  = this.getFavoris(userUid, nomStation);

    itemsCollection.snapshotChanges().take(1).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        itemsCollection.doc(snapshot.payload.doc.id).delete();
      });
    })

  }

}
