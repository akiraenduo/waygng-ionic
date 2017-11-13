import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
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

  constructor(public platform: Platform,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
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
          this.rootPage = "TabsPage";
        }else{
          this.rootPage = 'TutorialPage'; 
        } 

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

}
