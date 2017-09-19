import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import * as firebase from 'firebase/app';
import { FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  title: any;
  searchFavoris: any;
  favoris: FirebaseListObservable<any>;
  userUid: any;

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
        this.userUid = user.uid;
        this.favoris = this.favorisProvider.getFavoris(user.uid);
        this.searchFavoris = false;
      }else{
        this.searchFavoris = false;
        this.userUid = null;
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
    this.favorisProvider.removeFavoris(this.userUid,nomStation);
  }

  isNotConnected(){
    if(this.userUid == null){
      return true;
    }else{
      return false;
    }
  }

}
