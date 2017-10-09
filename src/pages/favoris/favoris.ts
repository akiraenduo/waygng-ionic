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
  loading: any;
  favoris: FirebaseListObservable<any>;
  userUid: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public favorisProvider: FavorisProvider,
              private afAuth: AngularFireAuth) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Favoris";
    }
    this.favoris = null;
  }

  ionViewDidLoad() {
    this.loading = true;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
        this.favoris = this.favorisProvider.getFavorisList(user.uid);
        this.favoris.subscribe(() => this.loading = false);
      }else{
        this.favoris = null;
        this.loading = false;
        this.userUid = null;
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

  isNotConnected():boolean{
    return this.userUid == null;
  }

}
