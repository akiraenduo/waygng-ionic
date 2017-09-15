import { Component } from '@angular/core';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Station } from '../../object/station';
import { HomePage } from '../home/home';

/**
 * Generated class for the StationSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-station-search',
  templateUrl: 'station-search.html',
})
export class StationSearchPage {

  public latitude: number;
  public longitude: number
  public allStations: Station[] = [];
  public stations: Station[] = [];
  public stationProches: Station[] = [];
  public searchPosition: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ginkoProvider: GinkoProvider, public geolocation: Geolocation) {
    this.getStationProches(null);
  }

  ionViewDidLoad() {
    this.ginkoProvider.fetchStations()
        .subscribe((stations) => {
          this.allStations = stations;
        }
    );
  }

  getStationProches(refresher){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      this.ginkoProvider.fetchStationsProche(this.latitude,this.longitude)
      .subscribe((stations) => {
        this.stationProches = stations;
        this.searchPosition = false;
        if(refresher){
          refresher.complete();
        }
      }
    );

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  doRefresh(refresher) {
    this.getStationProches(refresher);
  }

  getItems(ev) {

    this.stations = this.allStations;
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.stations = this.stations.filter((station) => {
        return (station.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemSelected(station){
    this.navCtrl.push(HomePage, {
      station:station
    });

  }

}
