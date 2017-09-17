import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { User } from '../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';

import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  userData: User;
  deconnected: any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private afAuth: AngularFireAuth, 
              private fb: Facebook) {
    this.initializeApp();


    this.afAuth.authState.subscribe(user => {
      if(user && user.uid){
        this.deconnected = false;
        this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
      }else{
        this.deconnected = true;
      }
    });


    this.deconnected = true;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Horaires', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {title : page.title });
  }

  signInWithFacebook() {
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
      return this.afAuth.auth
        .signInWithPopup(provider)
        .then(result =>{
          var user = result.user;
          this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
          this.deconnected = false;
        });
    }
  }

  getFacebookUser(){
    this.fb.getLoginStatus()
    .then((response) => {
      if(response && response.status == 'connected'){
        this.fb.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture_small)', []).then(profile => {
          this.userData = new User(profile['uid'],profile['email'],profile['first_name'],profile['name'],profile['picture_small']['data']['url']);
          this.deconnected = false;
        });
      }
    });
  }

}
