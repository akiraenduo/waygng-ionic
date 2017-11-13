import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Badge } from '@ionic-native/badge';
import { Storage } from '@ionic/storage';

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
              public storage: Storage,
              private badge: Badge) {

                
  }

  goProfile(){
    this.navCtrl.push('ProfilePage');
  } 

  ionViewWillEnter() {
    this.badge.clear();
    this.storage.get('userUid').then((userUid) => {
      this.userUid = userUid;
    });
  }

  ionViewDidLoad(){
    this.storage.get('userUid').then((userUid) => {
      this.userUid = userUid;
      if(userUid){
        this.loading = true;
        this.userUid = userUid;
        this.userProvider.getNotifications(userUid,true).snapshotChanges(['added','removed']).map(notifications => {
          return notifications.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
            })
          }).subscribe((notifications) => {
          this.notifications = notifications;
          notifications.forEach((notification) => {
            this.userProvider.updateSawNotification(this.userUid,notification.id);            
          })
          this.loading = false
        }) 
      }else{
        this.notifications = null;
        this.loading = false;
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
