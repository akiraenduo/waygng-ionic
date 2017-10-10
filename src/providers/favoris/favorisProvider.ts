import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

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

  addFavoris(userUid, nomStation){
    const items = this.afs.collection('/users/'+userUid+'/stations/');
    items.add({name:nomStation});
  }

  removeFavoris(userUid, nomStation){

    const itemsCollection  = this.getFavoris(userUid, nomStation);

    const removeSub = itemsCollection.snapshotChanges().subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        itemsCollection.doc(snapshot.payload.doc.id).delete();
        removeSub.unsubscribe();
      });
    })

  }

}
