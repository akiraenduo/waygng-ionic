import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { TabsUtils } from '../../utils/tabsUtils';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;
  subscription:Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController, 
              public tabsUtils: TabsUtils,
              public auth: AuthProvider) {
  }

  ionViewWillEnter() {
    this.tabsUtils.hide();
    this.subscription = this.auth.user.subscribe(user => {
      if(user){
        if(this.loader){
          this.loader.dismiss();
          this.loader = null;
          this.navCtrl.pop();
        }
      }
    });
  }

  ionViewWillLeave() {
    this.tabsUtils.show();
    if(this.subscription){
      this.subscription.unsubscribe();      
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: false
    });
    this.loader.present();
  }

  goHome(){
    this.navCtrl.parent.select(0);
    this.navCtrl.setRoot('HomePage');
  }

  facebookLogin(){
    this.presentLoading();
    this.auth.facebookLogin();
  }

}
