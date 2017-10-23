import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  loading: any;
  notifications: Array<any>;
  userUid: any;
  subscription: Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public userProvider: UserProvider) {

                this.loading = true;
                const userAuth = this.auth.user.subscribe(user => {
                  if (user) {
                    this.userUid = user.uid;
                    this.subscription = this.userProvider.getNotifications(user.uid).valueChanges().subscribe((notifications) => {
                      this.notifications = notifications;
                      this.loading = false
                    }) 
                  }else{
                    this.notifications = null;
                    this.loading = false;
                  }
                  userAuth.unsubscribe();
                });
  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  goDetailSpot(event){
    let spotId = event.currentTarget.id;
    this.navCtrl.push('SpotDetailPage', {spotKey : spotId});
  }

}
