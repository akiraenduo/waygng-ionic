import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Station } from '../../models/station';
import { TempsAttente } from '../../models/tempsattente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  latitude: number;
  longitude: number;
  errorMessage: string;
  loading: any = false;
  loadFavoris: any = false;
  noResult: any = false;
  stationProches: Station[] = [];
  station: any;
  listeTemps: TempsAttente[] = [];
  nomExact: string;
  searchModel: string;
  userUid: any;
  isInfavoris: any;
  subscription: Subscription;
  dateUpdate:any;
  searchPosition:any;
  favoris: any[] = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  geolocation: Geolocation,
              public userProvider: UserProvider, 
              public ginkoProvider: GinkoProvider,
              public favorisProvider: FavorisProvider,
              public auth: AuthProvider,
              public storage: Storage,
              public toastCtrl: ToastController) {

  
  }

  goProfile(){
    this.navCtrl.push('ProfilePage');
  }

  ionViewWillEnter() {
    this.storage.get('userUid').then((userUid) => {
      this.userUid = userUid;
    });
  }

  ionViewDidLoad(){
    this.station = this.navParams.get("station");
    if(!this.station){
      this.getStationProches(null);
    }

      this.isInfavoris = false;
    
      this.storage.get('userUid').then((userUid) => {
        this.userUid = userUid;
        if(userUid){
          if (this.station) {
            this.checkIfInFavoris();
          }else{
            this.getFavoris();
          }
        }
        if(this.station){
          this.searchModel = this.station.name;
          this.getTempsLieu(this.station,null);
        }
      }); 
  }  
  

  ionViewWillLeave() {
    if(this.subscription){
     // this.subscription.unsubscribe();
    }
  }

  checkIfInFavoris(){
    this.subscription = this.favorisProvider.getFavoris(this.userUid, this.station.name).valueChanges().subscribe(snapshot => {
      snapshot.forEach(station => {
       if(station && station["name"]){
          this.isInfavoris = true;
        }
      }); 
    });
  }

  itemSelected(station){
    this.station = station;
    this.searchModel = this.station.name;
    this.getTempsLieu(this.station,null);
    this.checkIfInFavoris();
  }

  getFavoris(){
    this.loadFavoris = true;
    this.subscription = this.favorisProvider.getFavorisList(this.userUid).valueChanges().subscribe((favoris) => {
      this.favoris = favoris;
      this.loadFavoris = false
    }); 
  }

  removeFavoris(station){
    this.favorisProvider.removeFavoris(this.userUid,station.name);
  }

  getStationProches(refresher){
    this.searchPosition = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.ginkoProvider.fetchStationsProche(this.latitude,this.longitude)
      .subscribe((stations) => {
        this.searchPosition = false;
        this.stationProches = stations;
        if(refresher){
          refresher.complete();
        }
      }
    );

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  clearSearchBar(){
    this.searchModel = null;
    this.station = null;
    this.getStationProches(null);
    this.getFavoris();
  }
 
  getTempsLieu(station,refresher){
    if(station){
      this.loading = true;
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
          this.dateUpdate = new Date().getTime();
          this.loading = false;
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

  localizationMap(){
    this.navCtrl.push('MapPage', {
      station:this.station
    });
  }

  searchStation(){
    this.navCtrl.push('StationSearchPage');
  }

  doRefresh(refresher) {
    if(this.station){
      this.getTempsLieu(this.station,refresher);
    }else{
      this.getStationProches(refresher);
    }
    
  }

  eventFavoris(){
    if(this.isInfavoris){
      this.isInfavoris = false;
      this.favorisProvider.removeFavoris(this.userUid,this.nomExact);
      this.createToast(this.nomExact+' supprimé des favoris !');
    }else{
      this.favorisProvider.addFavoris(this.userUid,this.station).then(() => {
        this.createToast(this.nomExact+' ajouté au favoris !');
      })
    }
  }

  createToast(message:string){
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }
  

}
