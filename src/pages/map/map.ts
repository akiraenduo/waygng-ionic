import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Station } from '../../models/station';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  HtmlInfoWindow,
  CameraPosition
 } from '@ionic-native/google-maps';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { Subscription } from 'rxjs/Subscription';

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
  watchSub: Subscription;

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

  ionViewWillLeave() {
    if(this.watchSub){
      this.watchSub.unsubscribe();
    }
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

            let watch = this.geolocation.watchPosition();
            this.watchSub = watch.subscribe((data) => {
              let cameraOptions: CameraPosition<any> = {
                  target: {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude
                  },
                  zoom: 15,
                  tilt: 30
              };
              this.map.moveCamera(cameraOptions);
            });
            
            // Now you can use all methods safely.
            stations.forEach((station) =>{

              let infoWindow = new HtmlInfoWindow();

              var div = document.createElement('div');
              div.innerHTML=station.name;
              div.className = "align-center";
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
              
              this.map.addMarker({
                icon: 'red',
                animation: 'DROP',
                position: {
                  lat: Number(station.latitude),
                  lng: Number(station.longitude)
                }
              }).then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    infoWindow.open(marker);
                  });
              });
            });

          });
      }

}
