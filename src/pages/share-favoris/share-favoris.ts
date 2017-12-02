import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { Station } from '../../models/station';
import { Subscription } from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-share-favoris',
  templateUrl: 'share-favoris.html',
})
export class ShareFavorisPage {

  loading: any;
  shareFavoris:any;
  station:Station;
  stationName:string;
  subscription:Subscription;

  constructor(public navCtrl: NavController,
              public favorisProvider: FavorisProvider, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loading = true;
    this.station = this.navParams.get("station");
    this.stationName = this.station.name;
    this.subscription = this.favorisProvider.getShareFavoris(this.station.id).valueChanges().subscribe((shareFavoris) =>{
      this.shareFavoris = shareFavoris;
      this.loading = false
    });
  }

  ionViewDidLeave(){
    this.subscription.unsubscribe();
  }

}
