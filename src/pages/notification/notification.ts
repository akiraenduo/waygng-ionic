import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { Badge } from '@ionic-native/badge';

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
              public userProvider: UserProvider,
              public toastCtrl: ToastController,
              private badge: Badge) {

                
  }

  ionViewWillEnter() {
    this.badge.clear();
    this.loading = true;
    const userAuth = this.auth.user.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.subscription = this.userProvider.getNotifications(user.uid).snapshotChanges().map(notifications => {
          return notifications.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
            })
          }).subscribe((notifications) => {
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

  goDetailSpot(notif){
    this.removeNotification(notif.id);
    this.navCtrl.push('SpotDetailPage', {spotKey : notif.spotUid});
  }

  removeNotif(notif){
    this.removeNotification(notif.id);
    this.toastCtrl.create({
      message: 'Notification supprimée !',
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  removeNotification(notifId){
    this.userProvider.removeNotification(this.userUid,notifId);
  }

}
