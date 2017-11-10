import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { Subscription } from 'rxjs/Subscription';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  loading: any;
  favoris: Array<any>;
  userUid: any;
  subscription: Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public favorisProvider: FavorisProvider,
              public storage: Storage) {

  }

  ionViewDidLoad() {
    this.loading = true;
    this.storage.get('userUid')
    .then((userUid) => {
      if (userUid) {
        this.userUid = userUid;
        this.subscription = this.favorisProvider.getFavorisList(userUid).valueChanges().subscribe((favoris) => {
          this.favoris = favoris;
          this.loading = false
        }); 
      }else{
        this.favoris = null;
        this.loading = false;
      }
    })  
  }

  ionViewWillLeave() {
    this.loading = false;
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  itemSelected(station){
    this.navCtrl.push('HomePage', {
      station:station
    });
  }

  removeFavoris(station){
    this.favorisProvider.removeFavoris(this.userUid,station.name);
  }

}
