import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';


import spotUtils from './spotUtils'
import { AuthProvider } from '../../providers/auth/auth';
import { Spot } from '../../models/spot';
import { PaginationService } from '../../providers/spot/paginationService';
import { Subscription } from 'rxjs/Subscription';


 
@IonicPage()
@Component({
  selector: 'page-spot',
  templateUrl: 'spot.html',
})
export class SpotPage {

  userUid: any;
  subscription: Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public db: AngularFireDatabase,
              public modalCtrl: ModalController,
              public page: PaginationService,
              public actionsheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public auth: AuthProvider) {


  }


  goLogin(){
    this.navCtrl.setRoot('LoginPage');
  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();        
    }
  }

  ionViewWillEnter() {  

    this.subscription = this.auth.user.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.page.init('spots', 'dateUpdate', { reverse: true, prepend: false}); 
      }else{
        this.userUid = null;
        this.goLogin();
      }
      this.subscription.unsubscribe();
    });
  }
  
  doRefresh(refresher) {
    this.page.init('spots', 'dateUpdate', { reverse: true, prepend: false }, refresher); 
  }


  doInfinite(infiniteScroll) {
    this.page.more(infiniteScroll);
  }

  goDetailSpot(spot:Spot){
    this.navCtrl.push('SpotDetailPage', {spotKey : spot.id});
  }

  incrementLike(spot){
    spotUtils.incrementLike(spot,this.userUid);
    this.spotProvider.incrementLikes(spot.id,spot);
  }


  goFiltreSpot(){
    this.navCtrl.push('SpotFilterPage');
  }

  goAddSpot(){
    this.navCtrl.push('AddSpotPage');
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
            this.showConfirm(spot);
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

removeSpot(spot:Spot){
  this.spotProvider.removeSpot(spot);
  this.page.init('spots', 'dateUpdate', { reverse: true, prepend: false}); 
}

updateSpot(spot){
  delete spot.doc;
  this.navCtrl.push('AddSpotPage', {
    spot:spot
  });
}



}
