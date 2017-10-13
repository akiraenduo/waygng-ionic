import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { FavorisPage } from '../pages/favoris/favoris';
import { InfosTraficPage } from '../pages/infos-trafic/infos-trafic';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SpotPage } from '../pages/spot/spot';

import { User } from '../models/user';

import { UserProvider } from '../providers/user/userProvider';
import { AngularFireAuth } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';

import * as moment from 'moment'
import { AuthProvider } from '../providers/auth/auth';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string,icon: string, component: any}>;

  userData: User;

  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public auth: AuthProvider,
              private afAuth: AngularFireAuth, 
              public userProvider: UserProvider,
              private fcm: FCM) {

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        this.rootPage = FavorisPage;
        this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
        this.initializeApp();
      }else{
        this.userData = null;
      }
      
    });           

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Horaires', icon:'md-alarm', component: HomePage },
      { title: 'Infos trafic', icon:'information-circle', component: InfosTraficPage },
      { title: 'Favoris', icon:'star', component: FavorisPage },
      { title: 'Spots', icon:'md-eye', component: SpotPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      moment.locale('fr-fr');
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#0091D4");
      this.splashScreen.hide();

      if(this.platform.is('cordova')){
        this.fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            alert( JSON.stringify(data));
          } else {
            alert( JSON.stringify(data));
          };
        })
    
        this.fcm.onTokenRefresh().subscribe(token=>{
          alert( JSON.stringify(token));
        })
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {title : page.title });
  }

  signIn(){
    this.menu.close();
    this.nav.push(LoginPage);
  }

  goProfile(){
    this.menu.close();
    this.nav.push(ProfilePage);
  }

  isDeconnected(){
    if(this.userData && this.userData.id){
      return false;
    }else{
      return true;
    }
  }

}
