import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

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
              private afAuth: AngularFireAuth) {
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

  fetchUsers():AngularFirestoreCollection<any>{
    return this.afs.collection('/users/')
  }

  updateUser(user:User){
    const items = this.afs.doc('/users/'+user.id);
    items.update({user: user});
    this.afAuth.auth.currentUser.updateProfile({displayName: user.username,photoURL:user.picture});
  }

  removeHistoryHashtag(userUid:string, hashtagKey:string){
    const item = this.afs.doc('/users/'+userUid+'/hashtagsHisto/'+hashtagKey);
    item.delete();
  }

  addHistoryHashtag(userUid:string, hashtagKey:string, hashtagName:string){
    const item = this.afs.doc('/users/'+userUid+'/hashtagsHisto/'+hashtagKey);
    item.set({"name":hashtagName.toLowerCase(), "tag":hashtagName, "dateUpdate": new Date().getTime()});
  }

  getHistoryHashtags(userUid:string):AngularFirestoreCollection<any>{
    return this.afs.collection('/users/'+userUid+'/hashtagsHisto', ref => ref.orderBy('dateUpdate','desc'));
  }

  storeToken(userUid:string,token:string){
    this.afs.collection('tokens').add({userUid:userUid, token:token});
  }

}
