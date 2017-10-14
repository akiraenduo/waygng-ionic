import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  title: any;
  loading: any;
  favoris: Observable<any[]>;
  userUid: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public favorisProvider: FavorisProvider,
              private auth: AuthProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Favoris";
    }
    this.favoris = null;
  }

  ionViewDidLoad() {
    this.loading = true;
    this.auth.user.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.favoris = this.favorisProvider.getFavorisList(user.uid).valueChanges();
        this.favoris.subscribe(() => this.loading = false);
      }else{
        this.favoris = null;
        this.loading = false;
      }
    });
  } 

  itemSelected(station){
    this.navCtrl.push(HomePage, {
      station:station
    });
  }

  removeFavoris(station, event: Event){
    event.stopPropagation();
    this.favorisProvider.removeFavoris(this.userUid,station.name);
  }

}
