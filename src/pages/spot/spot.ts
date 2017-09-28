import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { FirebaseListObservable } from 'angularfire2/database';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { Spot } from '../../models/spot';

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
  spots: Spot[];
  searchSpots: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider) {
    this.title = navParams.get("title");
    this.searchSpots = true;
    this.spotProvider.getSpotList().subscribe(spots => {
      spots.forEach(spotSnapshot => {
        userProvider.fetchUser(spotSnapshot.userUid).subscribe(user => {
          let spot = new Spot("",spotSnapshot.message,"",spotSnapshot.dateUpdate);
          console.log(spot);
        })
      });
    })
  }

  ionViewDidLoad() {

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
