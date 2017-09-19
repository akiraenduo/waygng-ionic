import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { FavorisPage } from '../pages/favoris/favoris';

import { User } from '../models/user';

import { UserProvider } from '../providers/user/userProvider';

import * as firebase from 'firebase/app';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string,icon: string, component: any}>;

  userData: User;
  deconnected: any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public userProvider: UserProvider) {
    this.initializeApp();

    this.deconnected = true;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Horaires', icon:'md-alarm', component: HomePage },
      { title: 'Favoris', icon:'star', component: FavorisPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          this.deconnected = true;
        } else { 
          this.deconnected = false;
          this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
        }
      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {title : page.title });
  }

  signInWithFacebook() {
    this.userProvider.login();
  }


  logout() {
    this.userProvider.logout();
    this.userData = null;
  }

}
