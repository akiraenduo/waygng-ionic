import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';
import { Station } from '../../models/station';
import { TempsAttente } from '../../models/tempsattente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { AngularFireAuth } from 'angularfire2/auth';


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
  userUid: any;
  isInfavoris: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  geolocation: Geolocation,
              public userProvider: UserProvider, 
              public ginkoProvider: GinkoProvider,
              public favorisProvider: FavorisProvider,
              private afAuth: AngularFireAuth) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Horaires";
    }
    this.station = navParams.get("station");

  }

  ionViewDidLoad() {
    this.isInfavoris = false;
    this.afAuth.authState.subscribe(user => {
      if (user && this.station) {
        this.userUid = user.uid;
          this.favorisProvider.getFavoris(this.userUid, this.station.name).subscribe(snapshot => {
            snapshot.forEach(station => {
              if(station && station.name){
                this.isInfavoris = true;
              }
            });
          })
      }else{
        this.userUid = null;
      }
    });

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

            let map = new Map;
            for (var i = 0; i < stationAttente.listeTemps.length; i++) {
              let currentStation = stationAttente.listeTemps[i];
              let key = currentStation.idLigne+currentStation.idArret;
              if(map.get(key) == null){
                map.set(key,[currentStation]);
              }else{
                let lstStation = map.get(key);
                lstStation.push(currentStation);
                map.set(key,lstStation);
              }
            }

            map.forEach(lstStation => {
              let lstTemps = [];
              let currentStation = lstStation[0];
              for (var i = 0; i < lstStation.length; i++) {
                lstTemps.push(lstStation[i].temps);
              }
              currentStation.lstTemps = lstTemps;
              this.listeTemps.push(currentStation);

            });

  

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

  eventFavoris(){
    if(this.isInfavoris){
      this.isInfavoris = false;
      this.favorisProvider.removeFavoris(this.userUid,this.nomExact);
    }else{
      this.favorisProvider.addFavoris(this.userUid,this.nomExact);
    }
  }
  

}
