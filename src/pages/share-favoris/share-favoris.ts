import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';


@IonicPage()
@Component({
  selector: 'page-share-favoris',
  templateUrl: 'share-favoris.html',
})
export class ShareFavorisPage {

  shareFavoris:any;

  constructor(public navCtrl: NavController,
              public favorisProvider: FavorisProvider, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    var stationId = this.navParams.get("stationId");
    this.shareFavoris = this.favorisProvider.getShareFavoris(stationId).valueChanges();
  }

}
