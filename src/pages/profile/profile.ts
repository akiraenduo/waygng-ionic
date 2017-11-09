import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Subscription } from 'rxjs/Subscription';
import spotUtils from '../spot/spotUtils'

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loading: any;
  user:any;
  mySpots:Array<any>;
  subscription: Subscription; 
  userUid:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public spotProvider: SpotProvider ) {

                const userAuth = this.auth.user.subscribe(user => {
                  if(user){
                    this.loading = true;
                    this.user = user;
                    this.userUid = user.uid;
                    this.subscription = spotProvider.getSpotsForCurrentUser(user.uid).snapshotChanges().map(spots => {
                      return spots.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        return { id, ...data };
                        })
                      }).subscribe(spots => {
                      this.mySpots = spots;
                      this.loading = false;
                    })
                  }
                  userAuth.unsubscribe();
                });
                

  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  incrementLike(spot){
    spotUtils.incrementLike(spot,this.userUid);
    this.spotProvider.incrementLikes(spot.id,spot);
  }

  openModalLike(spot) {
    let myModal = this.modalCtrl.create('ModalLikePage', { 'usersUid': spot.likes });
    myModal.present();
  }
  
  removeSpot(spot){
    this.spotProvider.removeSpot(spot);
  }

  showConfirm(spot) {
    let confirm = this.alertCtrl.create({
      title: 'Suppresion du spot',
      message: 'Etes vous certain de vouloir supprimer ce spot ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.removeSpot(spot);
            this.toastCtrl.create({
              message: 'Spot supprimé !',
              duration: 3000,
              position: 'bottom'
            }).present();
          }
        }
      ]
    });
    confirm.present();
  }

  logout() {
    this.navCtrl.setRoot('TabsPage'); 
    this.auth.logout();
  }

}
