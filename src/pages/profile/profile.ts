import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotProvider } from '../../providers/spot/spotProvider';
import spotUtils from '../spot/spotUtils';
import { Spot } from '../../models/spot';
import { UserProvider } from '../../providers/user/userProvider';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { PaginationService } from '../../providers/spot/paginationService';

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
  userUid:any;
  loader:any;
  segment = 'profil';
  receiveNotif:boolean;
  shareFav:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public userProvider: UserProvider,
              public favorisProvider: FavorisProvider,
              public page: PaginationService,
              public spotProvider: SpotProvider) {
                

  }

  ionViewWillEnter(){
    this.segment = 'profil';
  }


ionViewDidLoad(){
  this.auth.user.subscribe(user => {
    if(user){
      this.loading = true;
      this.user = user;
      this.userUid = user.uid;
      if(this.user.receiveNotif === undefined){
        this.receiveNotif = true;
      }else{
        this.receiveNotif = this.user.receiveNotif;
      }
      if(this.user.shareFav === undefined){
        this.shareFav = true;
      }else{
        this.shareFav = this.user.shareFav;
      }
      if(this.loader){
        this.loader.dismiss();
      }
      this.page.init('spots', 'dateUpdate', { reverse: true, prepend: false, userUid:this.userUid}); 
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

  goDetailSpot(spot:Spot){
    this.navCtrl.push('SpotDetailPage', {spotKey : spot.id});
  }

  updateReceiveNotif(receiveNotif){
    this.userProvider.updateReceiveNotif(this.userUid,receiveNotif);
  }

  updateShareFav(shareFav){
    this.userProvider.updateShareFav(this.userUid,shareFav);
    this.favorisProvider.getFavorisList(this.userUid).valueChanges().take(1).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if(shareFav){
          this.favorisProvider.addShareFavoris(this.user,snapshot.id);
        }else{
          this.favorisProvider.removeShareFavoris(this.userUid,snapshot.id);
        }
      });
    });
  }

}
