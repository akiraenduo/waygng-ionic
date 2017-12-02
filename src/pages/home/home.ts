import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController, Content, ActionSheetController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Station } from '../../models/station';
import { TempsAttente } from '../../models/tempsattente';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { UserProvider } from '../../providers/user/userProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  @ViewChild(Content) content: Content;

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
  dateUpdate:any;
  searchPosition:any;
  favoris: any[] = [];
  atBottom: any;
  user:User;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public  geolocation: Geolocation,
              public userProvider: UserProvider, 
              public ginkoProvider: GinkoProvider,
              public favorisProvider: FavorisProvider,
              public actionsheetCtrl: ActionSheetController,
              public auth: AuthProvider,
              public zone: NgZone,
              public toastCtrl: ToastController) {
  }


  ionViewDidLoad(){
    this.station = this.navParams.get("station");
    if(!this.station){
      this.searchModel = null;
      this.getStationProches(null);
    }

      this.isInfavoris = false;
    
      this.auth.user.subscribe(user => {
        if(user){
          this.user = user;
          this.userUid = user.uid;
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

  checkIfInFavoris(){
    this.favorisProvider.getFavoris(this.userUid, this.station.name).valueChanges().subscribe(snapshot => {
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
    this.favorisProvider.getFavorisList(this.userUid).valueChanges().subscribe((favoris) => {
      this.favoris = favoris;
      this.loadFavoris = false
    }); 
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
    this.navCtrl.setRoot('MapPage', {
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
      this.favorisProvider.removeShareFavoris(this.userUid,this.station.id);
      this.favorisProvider.removeFavoris(this.userUid,this.nomExact);
      this.createToast(this.nomExact+' supprimé des favoris !');
    }else{
      if(this.user.shareFav){
        this.favorisProvider.addShareFavoris(this.user,this.station.id);        
      }
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

  scrollHandler(event) {
    this.atBottom = false;
    if(this.content.getContentDimensions().scrollHeight !== this.content.getContentDimensions().contentHeight){
      this.zone.run(()=>{
        if (event.scrollTop + this.content.getContentDimensions().contentHeight > this.content.getContentDimensions().scrollHeight) {
          this.atBottom = true;
        }else{
          this.atBottom = false;
        }
      });
    }
  }

  showMore(){
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Voir sur la carte',
          handler: () => {
           this.localizationMap();
          }
        },
        {
          text: 'Voir les personnes ayant cette station en favoris',
          handler: () => {
           this.goShareFavoris();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel', // will always sort to be on the bottom
        }
      ]
    });
    actionSheet.present();
  }

  goShareFavoris(){
    this.navCtrl.push('ShareFavorisPage', {
      station:this.station
    });
  }
  

}
