import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Observable } from 'rxjs/Observable';

import { Station } from '../../object/station';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  private results: Observable<Station[]>;

  allStations: Station[] = [];
  stations: Station[] = [];

  public title;
  countries: string[];
  errorMessage: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Home";
    }
  }

  ionViewDidLoad() {

    this.rest.getStations()
      .subscribe((stations) => {
        this.allStations = stations;
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
  

}
