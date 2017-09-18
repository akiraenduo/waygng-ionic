import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth,} from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Geolocation } from '@ionic-native/geolocation';

import {StationSearchPage} from '../station-search/station-search';
import { Station } from '../../models/station';
import { User } from '../../models/user';
import { TempsAttente } from '../../models/tempsattente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  latitude: number;
  longitude: number;
  title;
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


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  geolocation: Geolocation, 
              public ginkoProvider: GinkoProvider, 
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Horaires";
    }
    this.station = navParams.get("station");

  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(user => {
      if(user && user.uid){
        this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
      }
    });

    if(this.station){
      this.searchModel = this.station.nom;
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
      this.ginkoProvider.fetchTempsLieu(station.nom)
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
    const items = this.db.list('/favoris');
    let stations = [];
    stations.push(this.nomExact);
    items.set( 'userUid', { userUid: this.userData.uid, stations: stations});
  }
  

}
