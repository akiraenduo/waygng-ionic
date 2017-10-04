import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { SpotDetailPage } from '../spot-detail/spot-detail';
import { SpotFilterPage } from '../spot-filter/spot-filter';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import * as _ from 'lodash'


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
  filter:string;
  spots = new BehaviorSubject([]);
  spotsFiltered = new BehaviorSubject([]);
  batch = 15        // size of each query
  lastDate = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached
  userUid: any;

  lastKey = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider,
              public db: AngularFireDatabase,
              private afAuth: AngularFireAuth) {

    this.filter = navParams.get("filter");                  
    this.searchSpots = true;
 
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        if(this.filter){
          this.getSpotsFiltered(null,null);
        }else{
          this.getSpots(null,null);
        } 
      }else{
        this.userUid = null;
      }
    });
  }

  doRefresh(refresher) {
    this.finished = false;
    this.lastDate = '';
    this.spots = new BehaviorSubject([]);
    this.getSpots(null,refresher);
  }


  doInfinite(infiniteScroll) {
    if(this.filter){
      this.getSpotsFiltered(infiniteScroll,null);
    }else{
      this.getSpots(infiniteScroll,null);
    }
      
  }

  goDetailSpot(spot){
    if(spot.$ref){
      this.navCtrl.push(SpotDetailPage, {spotKey : spot.$ref.key});
    }else{
      this.navCtrl.push(SpotDetailPage, {spotKey : spot.$key});
    }
  }

  private getSpotsFiltered(infiniteScroll,refresher){
    if (this.finished){
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return
    } 
    const getSpotList = this.spotProvider.fetchSpots(this.filter,this.lastKey,this.batch+1).do(item => {
      let lastSpot = _.last(item.spots);
      this.lastKey = lastSpot.$ref.key;

      const newSpots = _.slice(item.spots, 0, this.batch);
      const currentSpots = this.spotsFiltered.getValue();
      let lastNewSpot = _.last(newSpots);

      if (this.lastKey == lastNewSpot.$ref.key) {
        this.finished = true
      }
      this.spotsFiltered.next(_.concat(currentSpots,newSpots));
    });
    if(infiniteScroll){
      getSpotList.subscribe(() => infiniteScroll.complete())
    }else{
      getSpotList.subscribe(() => {
        this.searchSpots = false
        if(refresher){
          refresher.complete();
        }
      });
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
        .getSpotList(this.batch+1, this.lastDate)
        .do(spots => {
          /// set the lastKey in preparation for next query
          this.lastDate = _.last(spots)['dateUpdate']
          const newSpots = _.slice(spots, 0, this.batch)
          /// Get current spots in BehaviorSubject
          const currentSpots = this.spots.getValue()
          /// If data is identical, stop making queries
          if (this.lastDate == _.last(newSpots)['$key']) {
            this.finished = true
          }
          /// Concatenate new spots to current spots
          this.spots.next( _.concat(currentSpots, newSpots) )
        })
        .take(1);
        if(infiniteScroll){
          getSpotList.subscribe(() => infiniteScroll.complete())
        }else{
          getSpotList.subscribe(() => {
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

  isNotConnected():boolean{
    return this.userUid == null;
  }

}
