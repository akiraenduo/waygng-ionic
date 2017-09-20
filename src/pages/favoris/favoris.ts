import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


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
              public favorisProvider: FavorisProvider,
              private afAuth: AngularFireAuth) {
    this.title = navParams.get("title");
    this.favoris = null;
  }

  ionViewDidLoad() {
    this.searchFavoris = true;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.favoris = this.favorisProvider.getFavorisList(user.uid);
        this.searchFavoris = false;
      }else{
        this.favoris = null;
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
