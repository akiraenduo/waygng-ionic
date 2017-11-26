import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


import * as firebase from 'firebase/app';
import { FCM } from '@ionic-native/fcm';
import { User } from '../../models/user';


@Injectable()
export class AuthProvider {

  user:Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private platform: Platform,
              private fb: Facebook,
              private afs: AngularFirestore,
              private fcm: FCM) {

              this.user = this.afAuth.authState.switchMap(user => {
                if(user){
                  return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                }else{
                  return Observable.of(null);
                }
              })
  }
  
facebookLogin(){

  if (this.platform.is('cordova')) {
    return this.fb.login(['email', 'public_profile']).then(res => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      return firebase.auth().signInWithCredential(facebookCredential).then(user => {
        this.getFacebookUser(user.uid);
      });
    });
  }else{
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');
    return this.afAuth.auth.signInWithPopup(provider).then((credential) => {

      const data: User = {
        uid:credential.user.uid,
        email:credential.user.email,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL
      }
      this.getUser(data);
    })
  }

}

  private getFacebookUser(uid:string){
    return this.fb.getLoginStatus()
    .then((response) => {
      if(response && response.status == 'connected'){
        return this.fb.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture_small)', []).then(profile => {
          const data: User = {
            uid:uid,
            displayName: profile['name'],
            photoURL: profile['picture_small']['data']['url'],
            firstName: profile['first_name']
          }
          if(profile['email']){
            data.email = profile['email'];
          }
          this.getUser(data);
        })
      }
    });
  }

  private getUser(user:User){
    const item = this.afs.doc('/users/'+user.uid);
    this.fcm.getToken().then(token=>{
      user.token = token;
      item.set(user);
    });
  }

  logout() {
    firebase.database().goOffline();
    this.afAuth.auth.signOut();
   }


}
