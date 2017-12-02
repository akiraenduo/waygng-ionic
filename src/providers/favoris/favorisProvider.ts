import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Station } from '../../models/station';
import { User } from '../../models/user';


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
    const s:Station = {
      id:station.id,
      name:station.name,
      latitude:station.latitude,
      longitude:station.longitude
    }
    const items = this.afs.collection('/users/'+userUid+'/stations/');
    return items.add(s);
  }

  removeFavoris(userUid, nomStation){

    const itemsCollection  = this.getFavoris(userUid, nomStation);

    itemsCollection.snapshotChanges().take(1).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        itemsCollection.doc(snapshot.payload.doc.id).delete();
      });
    });

  }

  addShareFavoris(user:User, stationId:string){
    
    const u: User = {
      uid:user.uid,
      displayName:user.displayName,
      photoURL:user.photoURL
    }

    const item = this.afs.doc('/shareFavoris/'+stationId+'/users/'+u.uid);
    item.set(u);

  }
    
  removeShareFavoris(userUid:string, stationId:string){
        const item = this.afs.doc('/shareFavoris/'+stationId+'/users/'+userUid);
        item.delete();
  }

  getShareFavoris(stationId:string){
    return this.afs.collection('/shareFavoris/'+stationId+'/users/');
  }

}
