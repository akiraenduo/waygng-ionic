import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';
import { Station } from '../../models/station';
import { User } from '../../models/user';
import { TempsAttente } from '../../models/tempsattente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { UserProvider } from '../../providers/user/userProvider';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  latitude: number;
  longitude: number;
  title: any;
  errorMessage: string;
  searchPosition: any = false;
  noResult: any = false;
  stationProches: Station[] = [];
  station: any;
  listeTemps: TempsAttente[] = [];
  nomExact: string;
  searchModel: string;
  userData: User;
  fbProfile: any;
  favoris: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  geolocation: Geolocation,
              public userProvider: UserProvider, 
              public ginkoProvider: GinkoProvider,
              public favorisProvider: FavorisProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Horaires";
    }
    this.station = navParams.get("station");

  }

  ionViewDidLoad() {

    this.userData  = this.userProvider.getUser();
    if(this.userData && this.station){
      this.favorisProvider.getFavoris(this.userData.uid, this.station.name).subscribe(snapshot => {
        snapshot.forEach(station => {
          if(station && station.name){
            console.log(station.name);
          }
        });
      })

    }

    if(this.station){
      this.searchModel = this.station.name;
      this.getTempsLieu(this.station,null);
    }
    
  }

  getTempsLieu(station,refresher){
    if(station){
      this.searchPosition = true;
      this.noResult = false;
      if(this.listeTemps.length > 0){
        this.listeTemps = [];
      }
      this.ginkoProvider.fetchTempsLieu(station.name)
      .subscribe((stationAttente) => {
          this.nomExact = stationAttente.nomExact;
          if(stationAttente.listeTemps.length == 0){
            this.noResult = true;
          }else{
            for (var i = 0; i < stationAttente.listeTemps.length - 1; i++) {
                let lstTemps = [];
                let currentStation = stationAttente.listeTemps[i];
                let nextStation = stationAttente.listeTemps[i+1];
                if(currentStation.idArret == nextStation.idArret){
                  lstTemps.push(currentStation.temps);
                  lstTemps.push(nextStation.temps); 
                  currentStation.lstTemps = lstTemps; 
                  this.listeTemps.push(currentStation);
                }
            }

          }
          this.searchPosition = false;
          if(refresher != null){
            refresher.complete();
          }
        }
      );
   }
   if(refresher != null){
    refresher.complete();
   }
  }

  searchStation(){
    this.navCtrl.push(StationSearchPage);
  }

  doRefresh(refresher) {
    this.getTempsLieu(this.station,refresher);
  }

  addFavoris(){
    this.favorisProvider.addFavoris(this.userData.uid,this.nomExact);
  }
  

}
