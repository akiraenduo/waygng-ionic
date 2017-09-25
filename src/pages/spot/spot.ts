import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { FirebaseListObservable } from 'angularfire2/database';
import { SpotProvider } from '../../providers/spot/spotProvider';

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
  spots: FirebaseListObservable<any>;
  searchSpots: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider) {
    this.title = navParams.get("title");
    this.searchSpots = true;
    this.spots = this.spotProvider.getSpotList();
    this.spots.subscribe(() => this.searchSpots = false);
  }

  ionViewDidLoad() {

  }

  goAddSpot(){
    this.navCtrl.push(AddSpotPage);
  }

  fetchSpot(){
    this.spotProvider.fetchSpot("allende");
  }

}
