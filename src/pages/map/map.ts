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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              public ginkoProvider: GinkoProvider, 
              public googleMaps: GoogleMaps) {
                platform.ready().then(() => {
                  this.geolocation.getCurrentPosition().then((resp) => {
                    let latitude = resp.coords.latitude;
                    let longitude = resp.coords.longitude;
                    ginkoProvider.fetchStationsProche(latitude,longitude).subscribe((stations) => {
                      this.loadMap(latitude,longitude,stations);
                    })
                  });
                  
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
            zoom: 18,
            tilt: 30
          }
        };
    
        this.map = this.googleMaps.create('map', mapOptions);
    
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
          .then(() => {
            // Now you can use all methods safely.
            stations.forEach((station) =>{
              
              this.map.addMarker({
                title: station.name,
                icon: 'red',
                animation: 'DROP',
                position: {
                  lat: Number(station.latitude),
                  lng: Number(station.longitude)
                }
              });
            });
            this.map.addMarker({
                title: 'Me',
                icon: 'blue',
                animation: 'DROP',
                position: {
                  lat: latitude,
                  lng: longitude
                }
              })
              .then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    alert('clicked');
                  });
              });
    
          });
      }

}
