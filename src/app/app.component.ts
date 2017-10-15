import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { FavorisPage } from '../pages/favoris/favoris';
import { InfosTraficPage } from '../pages/infos-trafic/infos-trafic';
import { SpotPage } from '../pages/spot/spot';
import { FCM } from '@ionic-native/fcm';

import * as moment from 'moment'
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/userProvider';
import { ProfilePage } from '../pages/profile/profile';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string,icon: string, component: any}>;


  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public auth: AuthProvider,
              public userProviser: UserProvider,
              public loadingCtrl: LoadingController,
              private fcm: FCM) {   
                
      this.auth.user.subscribe(user => {
        if(user){
          this.rootPage = FavorisPage;
          this.menu.close();
        }else{
          this.rootPage = HomePage;
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

  goProfile(){
    this.menu.close();
    this.nav.push(ProfilePage);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loader.present();
  }

  facebookLogin(){
    this.presentLoading();
    this.auth.facebookLogin();
  }

}
