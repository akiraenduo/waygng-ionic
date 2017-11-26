import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'notification-button',
  templateUrl: 'notification-button.html'
})
export class NotificationButtonComponent {

  countNotification: number;
  userUid:any;

  constructor(public auth: AuthProvider,public navCtrl: NavController) {
    this.countNotification = 0;
    this.auth.user.subscribe(user => {
      if(user){
        this.userUid = user.uid;
        this.countNotification = user.notificationNotSaw;
      }else{
        this.userUid = null;
      }
    });
  }

  goNotification(){
    this.navCtrl.push('NotificationPage');
  }

}
