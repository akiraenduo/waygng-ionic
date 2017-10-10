import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Facebook } from '@ionic-native/facebook';

import * as firebase from 'firebase/app';
import { User } from '../../models/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  authState: any = null;

  constructor(public http: Http,
              public platform: Platform,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth, 
              private fb: Facebook,
              private fcm: FCM) {

                this.afAuth.authState.subscribe((auth) => {
                  this.authState = auth
                });

  }

  login() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then(user => {
          this.getFacebookUser(user.uid)
        });
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

  logout() {
   firebase.database().goOffline();
   this.afAuth.auth.signOut();
  }
  
  getCurrentUser():User{
    if(this.authState){
      return new User(this.authState.uid,this.authState.email,"",this.authState.displayName,this.authState.photoURL); 
    }
    return null;
  }

  fetchUser(uid:string):AngularFirestoreDocument<any>{
    return this.afs.doc('/users/'+uid);
  }

  updateUser(user:User){
    const items = this.afs.doc('/users/'+user.id);
    items.update({user: user});
    this.afAuth.auth.currentUser.updateProfile({displayName: user.username,photoURL:user.picture});
  }

  private getFacebookUser(uid:string){
    this.fb.getLoginStatus()
    .then((response) => {
      if(response && response.status == 'connected'){
        this.fb.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture_small)', []).then(profile => {
          let user = new User(uid,profile['email'],profile['first_name'],profile['name'],profile['picture_small']['data']['url']);
          return this.addUser(user);
        });
      }
    });
  }

  private addUser(user:User){
    firebase.database().goOnline();
    user = Object.assign({}, user);
    if (this.platform.is('cordova')) {
      this.fcm.getToken().then(token=>{
        const itemsCollection = this.afs.doc<any>('users/'+user.id);
        user["token"] = token;
        let infoUser = {infoUser: user};
        itemsCollection.set(infoUser);
      })
    }else{
      const itemsCollection = this.afs.doc<any>('users/'+user.id);
      let infoUser = {infoUser: user};
      itemsCollection.set(infoUser);
    }
    return user;
  }

  addHistoryHashtag(userUid:string, hashtagKey:string, hashtagName:string){
    const items = this.afs.doc('/users/'+userUid+'/hashtagsHisto/'+hashtagKey);
    items.set({"name":hashtagName.toLowerCase(), "tag":hashtagName});
  }

  getHistoryHashtags(userUid:string):AngularFirestoreCollection<any>{
    return this.afs.collection('/users/'+userUid+'/hashtagsHisto');
  }

  storeToken(userUid:string,token:string){
    this.afs.collection('tokens').add({userUid:userUid, token:token});
  }

}
