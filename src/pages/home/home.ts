import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';
import { Station } from '../../object/station';
import { TempsAttente } from '../../object/tempsattente';
import { StationAttente } from '../../object/stationAttente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';

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
  public station: any;
  public listeTemps: TempsAttente[] = [];
  public stationAttente: StationAttente;
  public nomExact: string;
  searchModel: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public ginkoProvider: GinkoProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Home";
    }
    this.station = navParams.get("station");

  }

  ionViewDidLoad() {
    if(this.station){
      this.searchModel = this.station.nom;
      this.getTempsLieu(this.station,null);
    }
    
  }

  getTempsLieu(station,refresher){
    if(station){
      this.searchPosition = true;
      this.ginkoProvider.fetchTempsLieu(station.nom)
      .subscribe((stationAttente) => {
          this.stationAttente = stationAttente;
          this.nomExact = this.stationAttente.nomExact;
          this.listeTemps = this.stationAttente.listeTemps;
          this.searchPosition = false;
          if(refresher != null){
            refresher.complete();
          }
        }
      );
   }
  }

  searchStation(){
    this.navCtrl.push(StationSearchPage);
  }

  doRefresh(refresher) {
    this.getTempsLieu(this.station,refresher);
  }
  

}
