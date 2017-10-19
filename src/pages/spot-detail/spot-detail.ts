import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';
import { ModalLikePage } from '../modal-like/modal-like';
import * as _ from 'lodash'


/**
 * Generated class for the SpotDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-spot-detail',
  templateUrl: 'spot-detail.html',
})
export class SpotDetailPage {

  spot:Observable<any>;
  userUid: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public spotProvider: SpotProvider,
              public modalCtrl: ModalController) {
                

              let spotKey = navParams.get("spotKey");

              this.auth.user.subscribe(user => {
                if (user) {
                  this.userUid = user.uid;
                  this.spot = spotProvider.getSpot(spotKey).valueChanges();
                }
              });

    }


  incrementLike(spot){
    if(!spot["likes"]){
      spot["likes"] = [];
    }
    const index = _.indexOf(spot["likes"], this.userUid);
    if(index < 0){
      spot["likes"].push(this.userUid);
      this.spotProvider.incrementLikes(spot.id,spot);
    }else{
      _.pullAt(spot["likes"], index);
      this.spotProvider.incrementLikes(spot.id,spot);
    }
  }

  openModalLike(spot) {
    let myModal = this.modalCtrl.create(ModalLikePage, { 'usersUid': spot.likes });
    myModal.present();
  }

}


