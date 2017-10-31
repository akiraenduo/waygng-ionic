import { Component, ViewChild } from '@angular/core';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { Station } from '../../models/station';
import { HomePage } from '../home/home';
import { Subscription } from 'rxjs/Subscription';
import { Hashtag } from '../../models/hashtag';
import { AngularFirestore } from 'angularfire2/firestore';
import * as _ from 'lodash';

/**
 * Generated class for the StationSearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-station-search',
  templateUrl: 'station-search.html',
})
export class StationSearchPage {

  @ViewChild('searchBar') searchBar: any;  

   latitude: number;
   longitude: number
   allStations: Station[] = [];
   stations: Station[] = [];
   stationProches: Station[] = [];
   searchPosition: any = false;
   searchStation: any = false;
   subscriptionFetchStation: Subscription;
   subscriptionFetchStationProche: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public ginkoProvider: GinkoProvider, 
              public geolocation: Geolocation,
              private afs: AngularFirestore,
              public Keyboard: Keyboard) {
    
  }



  ionViewDidLoad() {
    this.doFocus();
    this.getStations();
  }

  ionViewWillLeave() {
    this.subscriptionFetchStation.unsubscribe();
    if(this.subscriptionFetchStationProche){
      this.subscriptionFetchStationProche.unsubscribe();      
    }
  }


  getStations(){
    this.searchStation = true;
    this.subscriptionFetchStation = this.ginkoProvider.fetchStations()
    .subscribe((stations) => {
      this.allStations = stations;

      stations = _.uniqWith(stations, function(first, second){
        return first.name === second.name;
      });
      stations.forEach((station:Station) => {
        const h: Hashtag = {
          name:this.transform(station.name).toLowerCase(),
          tag:this.transform(station.name),
          icon:"md-bus"
        }

        const hashtagRef = this.afs.collection('/hashtags');
        //hashtagRef.add(h);
      })

      this.searchStation = false;
      this.getStationProches(null);
    });
  }

  transform(str:string){
    const arr = str.split(" ");
    return arr.map(word => word[0].toUpperCase() + word.substring(1) + " ").join('').replace(/\s/g, "");
  }

  getStationProches(refresher){
    this.searchPosition = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
     this.subscriptionFetchStationProche = this.ginkoProvider.fetchStationsProche(this.latitude,this.longitude)
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

  doFocus(){
    setTimeout(()=>{
      this.searchBar.setFocus();
      this.Keyboard.show();
    },1000);


    this.Keyboard.onKeyboardShow().subscribe((data)=>{
      this.searchBar.setFocus();
    })
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
        return (station.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemSelected(station){
    this.navCtrl.push(HomePage, {
      station:station
    });

  }

}
