import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage, ActionSheetController } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import spotUtils from '../spot/spotUtils'
import { Comment } from '../../models/comment';

/**
 * Generated class for the SpotDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-spot-detail',
  templateUrl: 'spot-detail.html',
})
export class SpotDetailPage {

  @ViewChild('commentInput') commentInput ;

  user:any;
  spot:any;
  spotId:any;
  userUid: any;
  subscription: Subscription;
  loading:boolean;
  commentModel: any;
  comments:any;
  commentUpdate:Comment;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public spotProvider: SpotProvider,
              public modalCtrl: ModalController,
              public actionsheetCtrl: ActionSheetController) {
                

              this.spotId = navParams.get("spotKey");

             const userAuth = this.auth.user.subscribe(user => {
               this.user = user;
                if (user) {
                  this.loading = true;
                  this.userUid = user.uid;
                  this.subscription = spotProvider.getSpot(this.spotId).valueChanges().subscribe(spot => {
                    this.spot = spot;
                    this.loading = false;
                  });
                  this.comments = spotProvider.getComments(this.spotId).valueChanges();
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

  sendComment(){
    if(this.commentUpdate){
      this.commentUpdate.content = this.commentModel; 
      this.spotProvider.updateComment(this.spotId,this.commentUpdate);      
    }else{
      this.spotProvider.addComment(this.spotId,this.commentModel,this.user);      
    }
    this.commentModel = null;
    this.commentUpdate = null;
  }

  editComment(comment:Comment){
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Modifier',
          handler: () => {
           this.updateComment(comment);
          }
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.removeComment(comment.id);
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

  removeComment(commentId:String){
    this.spotProvider.removeComment(this.spotId,commentId);
  }

  updateComment(comment:Comment){
    this.commentUpdate = comment;
    this.commentModel = comment.content;
    setTimeout(() => {
      this.commentInput.setFocus();
    },600);
  }

  cancelUpdateComment(){
    this.commentUpdate = null;
    this.commentModel = null;
  }

}


