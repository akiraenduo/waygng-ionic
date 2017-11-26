import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FCM } from '@ionic-native/fcm';

import * as moment from 'moment'
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/userProvider';
import { TranslateService } from '@ngx-translate/core';
import { Badge } from '@ionic-native/badge';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
}) 
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user:any;
  notifications:any;
  loader:any;
  pages: Array<{title: string,icon: string, component: any}>;

  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public loadingCtrl: LoadingController,
              public auth: AuthProvider,
              public userProviser: UserProvider,
              public fcm: FCM,
              public alertCtrl: AlertController, 
              private badge: Badge,
              private storage: Storage,
              private translate: TranslateService) {   


      this.initTranslate();

      this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = "HomePage";
        }else{
          this.rootPage = 'TutorialPage'; 
        } 

        this.translate.get('MENU').subscribe((menu) => {
          
                  this.pages = [
                    { title: menu.TIMETABLE, icon:'md-alarm', component: 'HomePage' },
                    { title: menu.MAP, icon:'md-navigate', component: 'MapPage' },
                    { title: menu.TRAFFIC_INFO, icon:'information-circle', component: 'InfosTraficPage' },
                    { title: menu.SPOTS, icon:'md-eye', component: 'SpotPage' },                  ];
            });

        this.initializeApp();
      })  

      this.auth.user.subscribe(user => {
        if(user){
          this.user = user;
          this.storage.set('userUid', this.user.uid);
          if(this.loader){
            this.loader.dismiss();
          }
        }else{
          this.user = null;
          this.storage.remove('userUid'); 
        }

      }); 

  }

  initializeApp() {
    this.platform.ready().then(() => { 
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#0091D4");
      this.splashScreen.hide();

      if(this.platform.is('cordova')){
        this.fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            this.badge.clear();
            this.userProviser.resetNotification(this.user.uid);
            this.userProviser.updateReadNotification(this.user.uid,data.notificationUid);
            this.nav.push('SpotDetailPage', {spotKey : data.spotUid});
          }
        })

      }
      
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('fr');
    moment.locale('fr-fr');
    if (this.translate.getDefaultLang() !== undefined) {
      this.translate.use(this.translate.getDefaultLang());
    } else {
      this.translate.use('fr'); // Set your language here
    }
}

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goProfile(){
    this.menu.close();
    if(this.user){
      this.nav.setRoot('ProfilePage');
    }else{
      this.nav.setRoot('LoginPage');
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  facebookLogin(){
    this.presentLoading();
    this.auth.facebookLogin();
  }

}
