import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Station } from '../../models/station';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
 } from '@ionic-native/google-maps';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public ginkoProvider: GinkoProvider, 
              public googleMaps: GoogleMaps) {

  }

  goProfile(){
    this.navCtrl.push('ProfilePage');
  } 



  ionViewWillEnter(){
    this.station = this.navParams.get("station");

    this.platform.ready().then(() => {
      if(this.station){
        let stations = [];
        stations.push(this.station);
        this.loadMap(this.station.latitude,this.station.longitude,stations);
      }else{
        this.geolocation.getCurrentPosition().then((resp) => {
          let latitude = resp.coords.latitude;
          let longitude = resp.coords.longitude;
          this.ginkoProvider.fetchStationsProche(latitude,longitude).subscribe((stations) => {
            this.loadMap(latitude,longitude,stations);
          })
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
            let markerList = [];
            // Now you can use all methods safely.
            stations.forEach((station) =>{
              
              this.map.addMarker({
                icon: 'red',
                animation: 'DROP',
                position: {
                  lat: Number(station.latitude),
                  lng: Number(station.longitude)
                }
              }).then(marker => {
                markerList.push(marker);
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    markerList.forEach((marker) => {
                      marker.setIcon('red');
                    });
                    marker.setIcon('blue');                    
                    let stationDetails = document.getElementById("stationDetails");
                    stationDetails.innerHTML = station.name;
                    this.stationSelected = station;
                    this.showStationDetail = true;
                  });
              });
            });

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
