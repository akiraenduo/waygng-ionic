import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { Station } from '../../object/station';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  public latitude: number;
  public longitude: number;
  public title;
  errorMessage: string;
  public searchPosition: any = false;
  public stationProches: Station[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public ginkoProvider: GinkoProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Home";
    }


    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.ginkoProvider.fetchStationsProche(this.latitude,this.longitude)
      .subscribe((stations) => {
        this.stationProches = stations;
      }
    );



      this.searchPosition = false;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

  ionViewDidLoad() {
    this.searchPosition = true;
  }


  searchStation(){
    this.navCtrl.push(StationSearchPage);
  }
  

}
