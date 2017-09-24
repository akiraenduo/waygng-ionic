import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

import { ToastController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../../providers/user/userProvider';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController,
              public menu: MenuController,  
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public userProvider: UserProvider, 
              private afAuth: AngularFireAuth, 
              private fb: Facebook) {

                const authSubscribe = this.afAuth.authState.subscribe(user => {
                if (user) {
                  this.menu.open();
                  this.navCtrl.setRoot(HomePage);
                  authSubscribe.unsubscribe();
                }
              });
  }

  login(user: User){
    let isOk = this.verifLogin(user);
    if(isOk){
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      result.catch( e => {
        this.showToast(e.message);
      });
      result.then(res => 
        this.navCtrl.setRoot(HomePage)
      );
    }
  }
  

  async doFacebookLogin() {
    this.fb.login(['public_profile','user_friends','email'])
    .then((res: FacebookLoginResponse) => {
      if(res && res.authResponse && res.authResponse.userID){
        this.navCtrl.setRoot(HomePage);
      }
    })  
    .catch(e => console.log('Error logging into Facebook', e));
  }


  signInWithFacebook() {
    this.userProvider.login();
  }

  verifLogin(user: User):boolean{
    if(!user.email){
      this.showToast("L'adresse email ne peut être vide");
      return false;
    }else{
      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
      if (!emailPattern.test(user.email)) {
        this.showToast(" Le format de l'adresse email est incorrecte");
        return false;
      }
    }
    if(!user.password){
      this.showToast("Le mot de passe ne peut être vide");
      return false;
    }
    return true;
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "bottom"
    });

    toast.present(toast);
  }


  register(){
    this.navCtrl.push(RegisterPage);
  }

}
