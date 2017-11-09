import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';


import * as _ from 'lodash'
import spotUtils from './spotUtils'
import { TabsUtils } from '../../utils/tabsUtils';



/**
 * Generated class for the SpotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 
@IonicPage()
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public db: AngularFireDatabase,
              public auth: AuthProvider,
              public modalCtrl: ModalController,
              public storage: Storage,
              public tabsUtils: TabsUtils) {

  }
  
  ionViewDidEnter() {
    this.tabsUtils.show();
    this.searchSpots = true;
    this.storage.get('userUid')
    .then((userUid) => {
      if (userUid) {
        this.userUid = userUid;
        this.finished = false;
        this.lastDate = '';
        this.getSpots(null,null); 
      }else{
        this.userUid = null;
      }
    })
  }
  
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
    this.navCtrl.push('SpotDetailPage', {spotKey : spot.id});
  }

  incrementLike(spot){
    spotUtils.incrementLike(spot,this.userUid);
    this.spotProvider.incrementLikes(spot.id,spot);
  }
 

  private getSpots(infiniteScroll,refresher) {
    if (this.finished){
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return
    } 
     this.spotProvider
        .getSpotList(this.batch+1, this.lastDate).stateChanges(['added'])
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
        }).subscribe(() =>{
          if(infiniteScroll){
            infiniteScroll.complete();
          }else{
            this.searchSpots = false
            if(refresher){
              refresher.complete();
            }
          }
        });
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


}
