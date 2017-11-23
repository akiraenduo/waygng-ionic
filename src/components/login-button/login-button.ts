import { Component, Input } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login-button',
  templateUrl: 'login-button.html'
})
export class LoginButtonComponent {

  @Input() warningMessage: string;

  loader:any;

  constructor(
              public loadingCtrl: LoadingController,
              public auth: AuthProvider) {
                this.auth.user.subscribe(user => {
                  if(user){
                    if(this.loader){
                      this.loader.dismiss();
                      this.loader = null;
                    }
                  }
                });
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
