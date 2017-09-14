import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  public latitude: number;
  public longitude: number;
  public title;
  errorMessage: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Home";
    }


    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

  ionViewDidLoad() {

  }


  searchStation(){
    this.navCtrl.push(StationSearchPage);
  }
  

}
