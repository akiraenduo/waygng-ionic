import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';

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
              public auth: AuthProvider) {
  }

  ionViewWillEnter() {
    this.subscription = this.auth.user.subscribe(user => {
      if(user){
        if(this.loader){
          this.loader.dismiss();
          this.loader = null;
          this.navCtrl.setRoot("ProfilePage");
        }
      }
    });
  }

  ionViewWillLeave() {
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

  facebookLogin(){
    this.presentLoading();
    this.auth.facebookLogin();
  }

}
