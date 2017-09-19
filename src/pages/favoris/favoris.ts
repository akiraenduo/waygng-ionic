import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { HomePage } from '../home/home';
import { Station } from '../../models/station';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import * as firebase from 'firebase/app';
import { FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  title: any;
  userData: User;
  searchFavoris: any;
  favoris: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public favorisProvider: FavorisProvider) {
    this.title = navParams.get("title");
    this.favoris = null;
  }

  ionViewDidLoad() {
    this.searchFavoris = true;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.favoris = this.favorisProvider.getFavoris(user.uid);
        this.searchFavoris = false;
      }
    });
  }

  itemSelected(station){
    this.navCtrl.push(HomePage, {
      station:station
    });
  }

  removeFavoris(nomStation, event: Event){
    event.stopPropagation();
    console.log(nomStation);
  }

}
