import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import spotUtils from '../spot/spotUtils'
import { TabsUtils } from '../../utils/tabsUtils';

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

  user:any;
  spot:any;
  spotId:any;
  userUid: any;
  subscription: Subscription;
  loading:boolean;
  commentModel: any;
  comments:any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public spotProvider: SpotProvider,
              public modalCtrl: ModalController,
              public tabsUtils: TabsUtils) {
                

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

    ionViewWillEnter() {
      this.tabsUtils.hide();
    }

    ionViewWillLeave() {
      this.tabsUtils.show();
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
    this.spotProvider.addComment(this.spotId,this.commentModel,this.user);
    this.commentModel = null;
  }

}


