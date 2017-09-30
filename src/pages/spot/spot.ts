import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
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

  title:any
  searchSpots: any;

  spots = new BehaviorSubject([]);
  batch = 15        // size of each query
  lastDate = ''      // key to offset next query from
  finished = false  // boolean when end of database is reached

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider,
              public db: AngularFireDatabase) {

    this.title = navParams.get("title");
    this.searchSpots = true;

  }

  ionViewDidLoad() {
    this.getSpots(null,null);
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

  }

  goAddSpot(){
    this.navCtrl.push(AddSpotPage);
  }

  fetchSpot(){
    this.spotProvider.fetchHashtag("ga").subscribe(snapshots =>{
      snapshots.forEach(snapshot => {
        console.log(snapshot.val().name);
      });
    })
  }

}
