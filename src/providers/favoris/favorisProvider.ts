import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';

/*
  Generated class for the FavorisProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavorisProvider {

  constructor(public http: Http) {
  }

  getFavoris(userUid): string[] {
    let stations = [];
    firebase.database().ref("/users/"+userUid+"/stations").on('value', snapshot => {
      snapshot.forEach(snap  => {
        stations.push(snap.val());
        return false;
      });
    });
    return stations;
  }

}
