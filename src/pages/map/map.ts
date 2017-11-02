import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';

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
              public googleMaps: GoogleMaps) {
                platform.ready().then(() => {
                  this.geolocation.getCurrentPosition().then((resp) => {
                    let latitude = resp.coords.latitude;
                    let longitude = resp.coords.longitude;
                    this.loadMap(latitude,longitude);
                  });
                  
                }).catch((error) => {
                  console.log('Error getting location', error);
                });
  }

  loadMap(latitude:number,longitude:number) {
    
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
            console.log('Map is ready!');
    
            // Now you can use all methods safely.
            this.map.addMarker({
                title: 'Ionic',
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
