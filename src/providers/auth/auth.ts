import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


import * as firebase from 'firebase/app';


interface User{
  uid:string;
  email:string;
  photoURL?:string;
  displayName?:string;

}


@Injectable()
export class AuthProvider {

  user:Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {

              this.user = this.afAuth.authState.switchMap(user => {
                if(user){
                  return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                }else{
                  return Observable.of(null);
                }
              })
  }
  
facebookLogin(){
  const provider = new firebase.auth.FacebookAuthProvider();
  return this.afAuth.auth.signInWithPopup(provider).then((credential) => {
    this.updateUserData(credential.user);
  })
}

private updateUserData(user){

  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

  const data: User = {
    uid:user.uid,
    email:user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  }

  return userRef.set(data);


}


}
