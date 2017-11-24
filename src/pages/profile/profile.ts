import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotProvider } from '../../providers/spot/spotProvider';
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
  userUid:any;
  loader:any;
  segment = 'profil';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public spotProvider: SpotProvider) {
                

  }

  ionViewWillEnter(){
    this.segment = 'profil';
    if(!this.userUid){
      this.navCtrl.setRoot("LoginPage",{
        from:"ProfilePage"
      });
    }
  }


ionViewDidLoad(){
  this.auth.user.subscribe(user => {
    if(user){
      this.loading = true;
      this.user = user;
      this.userUid = user.uid;
      if(this.loader){
        this.loader.dismiss();
      }
      this.spotProvider.getSpotsForCurrentUser(user.uid).snapshotChanges().map(spots => {
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
  });
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
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  facebookLogin(){
    this.presentLoading();
    this.auth.facebookLogin();
  }
  logout() {
    this.navCtrl.setRoot('HomePage'); 
    this.auth.logout();
  }

}
