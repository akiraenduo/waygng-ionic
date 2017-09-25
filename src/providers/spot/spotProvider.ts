import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Spot } from '../../models/spot';

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
    const items = this.db.list('/spots');
    items.push(spot);
  }

  getSpotList(): FirebaseListObservable<any>{
    return this.db.list('/spots');
   }

}
