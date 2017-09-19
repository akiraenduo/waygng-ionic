import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Facebook } from '@ionic-native/facebook';

import * as firebase from 'firebase/app';
import { User } from '../../models/user';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: Http,
              public platform: Platform,
              public db: AngularFireDatabase, 
              private fb: Facebook) {
    console.log('Hello UserProvider Provider');
  }

  login(): firebase.Promise<any> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then(res => this.getFacebookUser());
      })
    }
    else {

      var provider = new firebase.auth.FacebookAuthProvider();
      // You can add additional scopes to the provider:
      provider.addScope('email');
      provider.addScope('public_profile');
      return firebase.auth().signInWithPopup(provider).then(result =>{
        let user = new User(result.user.uid,result.user.email,"",result.user.displayName,result.user.photoURL);
        return this.addUser(user);
      });
    }
  }

  logout(): firebase.Promise<void> {
    return firebase.auth().signOut();
  }

  private getFacebookUser(){
    this.fb.getLoginStatus()
    .then((response) => {
      if(response && response.status == 'connected'){
        this.fb.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture_small)', []).then(profile => {
          let user = new User(profile['uid'],profile['email'],profile['first_name'],profile['name'],profile['picture_small']['data']['url']);
          return this.addUser(user);
        });
      }
    });
  }

  private addUser(user){
    const items = this.db.list('/users/'+user.uid);
    items.set('user', user);
    return user;
  }

}
