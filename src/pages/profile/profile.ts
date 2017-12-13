import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
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
              public actionsheetCtrl: ActionSheetController,
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
  

  editSpot(spot:Spot){
    if(spot.userUid == this.userUid){
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Modifier',
          handler: () => {
           this.updateSpot(spot);
          }
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.removeSpot(spot);
          }
        },
        {
          text: 'Annuler',
          role: 'cancel', // will always sort to be on the bottom
        }
      ]
    });
    actionSheet.present();
  }
}

removeSpot(spot:Spot){
  this.spotProvider.removeSpot(spot);
}

updateSpot(spot:Spot){
  this.navCtrl.push('AddSpotPage', {
    spot:spot
  });
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
