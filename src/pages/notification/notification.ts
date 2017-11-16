import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Badge } from '@ionic-native/badge';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsUtils } from '../../utils/tabsUtils';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public toastCtrl: ToastController,
              public auth: AuthProvider,
              private badge: Badge,
              public tabsUtils: TabsUtils) {

                 
  }

  goProfile(){
    this.navCtrl.push('ProfilePage');
  } 

  ionViewWillEnter(){
    this.tabsUtils.show();
    this.badge.clear();
    if(this.userUid){
      this.userProvider.resetNotification(this.userUid);
    }
  }

  ionViewDidLoad(){
    this.auth.user.subscribe(user => {
      if(user){
        this.userUid = user.uid;
        this.loading = true;
        this.userProvider.getNotifications(this.userUid,true).snapshotChanges(['added','removed']).map(notifications => {
          return notifications.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
            })
          }).subscribe((notifications) => {
            this.notifications = notifications;
            this.loading = false});
      }else{
        this.notifications = null;
      }

    }); 
  }

  goDetailSpot(notif){
    this.userProvider.updateReadNotification(this.userUid,notif.id);
    this.navCtrl.push('SpotDetailPage', {spotKey : notif.spotUid});
  }

  removeNotif(notif){
    this.removeNotification(notif.id);
  }

  removeNotification(notifId){
    this.userProvider.removeNotification(this.userUid,notifId);
  }

}
