import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Station } from '../../models/station';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  HtmlInfoWindow
 } from '@ionic-native/google-maps';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import * as _ from 'lodash'

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: GoogleMap;
  station:any;
  stationSelected:any;
  showStationDetail:any;
  stationsAdded:Station[];
  searchModel: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public ginkoProvider: GinkoProvider, 
              public googleMaps: GoogleMaps) {

  }


  ionViewWillEnter(){
    this.station = this.navParams.get("station");
    this.stationsAdded = [];

    this.platform.ready().then(() => {
      if(this.station){
        this.searchModel = this.station.name;
        let stations = [];
        stations.push(this.station);
        this.loadMap(this.station.latitude,this.station.longitude,stations);
      }else{
        this.geolocation.getCurrentPosition().then((resp) => {
          let latitude = resp.coords.latitude;
          let longitude = resp.coords.longitude;
          this.ginkoProvider.fetchStationsProche(latitude,longitude).subscribe((stations) => {
            this.loadMap(latitude,longitude,stations);
          });
        });
      }

      
    }).catch((error) => {
      alert('Error getting location');
    });
  }


  loadMap(latitude:number,longitude:number,stations:Station[]) {
    
        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: latitude,
              lng: longitude
            },
            zoom: 15,
            tilt: 30
          },
          controls: {
            compass: true,
            myLocationButton: true,
            indoorPicker: false,
            zoom: false
          }
        };
    
        this.map = this.googleMaps.create('map', mapOptions);
        this.map.setMyLocationEnabled(true);
    
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
          .then(() => {

            this.map.on(GoogleMapsEvent.CAMERA_MOVE_END)
            .subscribe((location) => {
              this.ginkoProvider.fetchStationsProche(location[0].target.lat,location[0].target.lng).subscribe((stations) => {
                this.addStations(stations);
              });

            });

            this.addStations(stations);
          });
      }

      addStations(stations:Station[]){
        stations = this.removeDuplicate(stations);
        // Now you can use all methods safely.
        stations.forEach((station) =>{

          let infoWindow = new HtmlInfoWindow();
          
          var div = document.createElement('div');
          div.innerHTML=station.name;
          div.className = "infoWindow-style";
          div.id = station.name;
          var self = this;
          div.addEventListener("click", function (event) {
            var stationName = this.id
            const s: Station = {
              name:stationName,
            }
            self.navCtrl.push('HomePage', {
              station:s
            });
          });
          
          infoWindow.setContent(div);

          if(!_.find(this.stationsAdded, station)){
            this.map.addMarker({
              icon: 'red',
              position: {
                lat: Number(station.latitude),
                lng: Number(station.longitude)
              }
            }).then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  infoWindow.open(marker);                  
                  this.searchModel = station.name;
                  this.stationSelected = station;
                  this.showStationDetail = true;
                });
            });
            this.stationsAdded.push(station);
        }
        });
      }

      removeDuplicate(stations:Station[]):Station[]{
        return _.uniqWith(stations, function(first, second){
          return first.name === second.name;
        });
      }


      goHomePage(){
        if(this.stationSelected){
          this.navCtrl.setRoot('HomePage', {
            station:this.stationSelected
          });
        }
      }

}
