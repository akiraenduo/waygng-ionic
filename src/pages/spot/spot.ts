import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { SpotDetailPage } from '../spot-detail/spot-detail';
import { SpotFilterPage } from '../spot-filter/spot-filter';
import { AuthProvider } from '../../providers/auth/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';


import * as _ from 'lodash'
import { ModalLikePage } from '../modal-like/modal-like';
import { Subscription } from 'rxjs/Subscription';



/**
 * Generated class for the SpotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 
@Component({
  selector: 'page-spot',
  templateUrl: 'spot.html',
})
export class SpotPage {

  searchSpots: any;
  spots = new BehaviorSubject([]);
  batch = 15        // size of each query
  lastDate = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached
  userUid: any;
  subscription: Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public db: AngularFireDatabase,
              public auth: AuthProvider,
              public modalCtrl: ModalController) {

    this.searchSpots = true;

    const userAuth = this.auth.user.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
          this.getSpots(null,null);
      }else{
        this.userUid = null;
      }
      userAuth.unsubscribe();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  ionViewDidWi

  doRefresh(refresher) {
    this.finished = false;
    this.lastDate = '';
    this.spots = new BehaviorSubject([]);
    this.getSpots(null,refresher);
  }


  doInfinite(infiniteScroll) {
    this.getSpots(infiniteScroll,null);
  }

  goDetailSpot(spot){
    this.navCtrl.push(SpotDetailPage, {spotKey : spot.id});
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
 

  private getSpots(infiniteScroll,refresher) {
    if (this.finished){
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return
    } 
    const getSpotList = this.spotProvider
        .getSpotList(this.batch+1, this.lastDate).snapshotChanges()
        .map(spots => {
          return spots.map(s => {
            const data = s.payload.doc.data();
            const id = s.payload.doc.id;
            return { id, ...data };
          });
        })
        .do(spots => {
          if(spots.length > 0){
            /// set the lastKey in preparation for next query 
            this.lastDate = _.last(spots).dateUpdate;
            const newSpots = _.slice(spots, 0, this.batch)
            /// Get current spots in BehaviorSubject
            const currentSpots = this.spots.getValue()
            /// If data is identical, stop making queries
            if (this.lastDate == _.last(newSpots).dateUpdate) {
              this.finished = true
            }
            /// Concatenate new spots to current spots
            this.spots.next( _.concat(currentSpots, newSpots) )
          }
        });
        if(infiniteScroll){
          this.subscription = getSpotList.subscribe(() => {
            infiniteScroll.complete();
          })
        }else{ 
          this.subscription = getSpotList.subscribe((spots) => {
            this.spots.next(spots);
            this.searchSpots = false
            if(refresher){
              refresher.complete();
            }
          });
        }

  }


  goFiltreSpot(){
    this.navCtrl.push(SpotFilterPage);
  }

  goAddSpot(){
    this.navCtrl.push(AddSpotPage);
  }

  openModalLike(spot) {
    let myModal = this.modalCtrl.create(ModalLikePage, { 'usersUid': spot.likes });
    myModal.present();
  }


}
