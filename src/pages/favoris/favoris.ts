import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/user';
import { HomePage } from '../home/home';
import { Station } from '../../models/station';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import * as firebase from 'firebase/app';


@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  title: any;
  userData: User;
  favoris: string[] = [];
  searchFavoris: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public favorisProvider: FavorisProvider) {
    this.title = navParams.get("title");
  }

  ionViewDidLoad() {
    this.searchFavoris = true;
    firebase.auth().onAuthStateChanged((user) => {
      this.favoris = [];
      if (user) {
        this.favoris = this.favorisProvider.getFavoris(user.uid);
        this.searchFavoris = false;
      }
    });
  }

  itemSelected(nomStation){
    let station = new Station("",nomStation,"","");
    this.navCtrl.push(HomePage, {
      station:station
    });
  }

  removeFavoris(nomStation, event: Event){
    event.stopPropagation();
    console.log(nomStation);
  }

}
