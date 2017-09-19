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

  getFavoris(userUid): FirebaseListObservable<any>{
   return this.db.list('/users/'+userUid+'/stations');
  }

  addFavoris(userUid,nomStation){
    const items = this.db.list('/users/'+userUid+'/stations');
    items.push({name:nomStation});
  }

  removeFavoris(userUid,nomStation){
    const items = this.db.list('/users/'+userUid+'/stations');
    items.remove(nomStation);
  }

}
