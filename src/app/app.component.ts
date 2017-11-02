import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FCM } from '@ionic-native/fcm';

import * as moment from 'moment'
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/userProvider';
import { TranslateService } from '@ngx-translate/core';
import { Badge } from '@ionic-native/badge';
import { NativeStorage } from '@ionic-native/native-storage';





@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user:any;
  notifications:any;

  pages: Array<{title: string,icon: string, component: any}>;


  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public auth: AuthProvider,
              public userProviser: UserProvider,
              public loadingCtrl: LoadingController,
              public fcm: FCM,
              public alertCtrl: AlertController, 
              private badge: Badge,
              private nativeStorage: NativeStorage,
              private translate: TranslateService) {   
                
      this.initTranslate();

      this.auth.user.subscribe(user => {
        if(user){
          this.notifications = this.userProviser.getNotifications(user.uid,false).valueChanges();
          this.user = user;
          this.rootPage = 'FavorisPage';
          this.menu.close();
        }else{
          this.user = null;
          this.rootPage = 'HomePage';
        }

        this.initializeApp();
        moment.locale('fr-fr');

      }); 
      

      this.translate.get('MENU').subscribe((menu) => {

        this.pages = [
          { title: menu.TIMETABLE, icon:'md-alarm', component: 'HomePage' },
          { title: menu.TRAFFIC_INFO, icon:'information-circle', component: 'InfosTraficPage' },
          { title: menu.FAVORIS, icon:'star', component: 'FavorisPage' },
          { title: menu.SPOTS, icon:'md-eye', component: 'SpotPage' },
          { title: menu.NOTIFICATIONS, icon:'md-notifications', component: 'NotificationPage' },
        ];
  })

  }

  initializeApp() {
    this.platform.ready().then(() => { 

      if(this.platform.is('cordova')){
        //this.nativeStorage.clear();
        this.nativeStorage.getItem('launchCount').then(
          data => {
            if(!data){
              alert("ICI");
              // first launch
            this.nativeStorage.setItem('launchCount', 1).then(() => {
              this.rootPage = 'TutorialPage';
            })
            }else{
              //alert("LA");
            }

          },
          error => {
            // first launch
            this.nativeStorage.setItem('launchCount', 1).then(() => {
              this.rootPage = 'TutorialPage';
            })
          }
        );
      }


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#0091D4");
      this.splashScreen.hide();

      if(this.platform.is('cordova')){
        this.fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            this.badge.clear();
            this.userProviser.updateSawReadNotification(this.user.uid,data.notificationUid);
            this.nav.push('SpotDetailPage', {spotKey : data.spotUid});
          }
        })

      }
      
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('fr');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('fr'); // Set your language here
    }
}

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {title : page.title });
  }

  goProfile(){
    this.menu.close();
    this.nav.push('ProfilePage');
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
