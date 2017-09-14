import { Component } from '@angular/core';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { NavController, NavParams } from 'ionic-angular';

import { Station } from '../../object/station';
import { RealTimePage } from '../real-time/real-time';

import * as _ from 'lodash';

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

  allStations: Station[] = [];
  stations: Station[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public ginkoProvider: GinkoProvider) {
  }

  ionViewDidLoad() {
    this.ginkoProvider.getStations()
        .subscribe((stations) => {
          this.allStations = _.uniqWith(stations, function(first, second){
                return first.nom === second.nom;
            });
        }
    );
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
    this.navCtrl.push(RealTimePage, {
      station:station
    });

  }

}