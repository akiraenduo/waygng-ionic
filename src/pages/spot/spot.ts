import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AddSpotPage } from '../add-spot/add-spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

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
  spots: Observable<any>;
  searchSpots: any;
  getSpotListSub: Subscription; 

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider,
              public db: AngularFireDatabase) {

    this.title = navParams.get("title");
    this.searchSpots = true;
    this.spots = this.spotProvider.getSpotList(null);
    this.spots.subscribe(() => this.searchSpots = false);

  }

  ionViewDidLoad() {

  }

  ionViewWillLeave() {
    //this.getSpotListSub.unsubscribe();
  }


  doInfinite(infiniteScroll) {
      console.log('Begin async operation');
      this.spots.subscribe(result =>{
        let lastSpot = result[result.length-1];
        this.spots = this.spotProvider.getSpotList(lastSpot.$key);
        this.spots.subscribe(() => infiniteScroll.complete());
      });

      console.log('Async operation has ended');

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
