import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { User } from '../../models/user';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public photoLibrary: PhotoLibrary,
              public toastCtrl: ToastController,
              public platform: Platform,) {

  }

  ionViewDidLoad() {

  }


  logout() {
    this.navCtrl.setRoot(HomePage); 
    this.auth.logout();
  }

}
