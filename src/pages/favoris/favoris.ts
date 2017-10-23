import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';

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
              private auth: AuthProvider) {

    this.loading = true;
    const userAuth = this.auth.user.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.subscription = this.favorisProvider.getFavorisList(user.uid).valueChanges().subscribe((favoris) => {
          this.favoris = favoris;
          this.loading = false
        }) 
      }else{
        this.favoris = null;
        this.loading = false;
      }
      userAuth.unsubscribe();
    });
  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  itemSelected(station){
    this.navCtrl.push('HomePage', {
      station:station
    });
  }

  removeFavoris(station, event: Event){
    event.stopPropagation();
    this.favorisProvider.removeFavoris(this.userUid,station.name);
  }

}
