import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform) {
  }

  async login(user: User){
    try{
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      if(result){
        this.navCtrl.setRoot(HomePage);
      }
    }catch(e){
      console.error(e);
    }
  }

  async doFacebookLogin() {
    this.fb.login(['public_profile','user_friends','email'])
    .then((res: FacebookLoginResponse) => {
      if(res && res.authResponse && res.authResponse.userID){
        this.navCtrl.setRoot(HomePage);
      }
    })  
    .catch(e => console.log('Error logging into Facebook', e));
  }


  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential).then(res => this.navCtrl.setRoot(HomePage));
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }


  register(){
    this.navCtrl.push(RegisterPage);
  }

}
