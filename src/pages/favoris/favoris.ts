import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { FavorisProvider } from '../../providers/favoris/favorisProvider';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


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
        this.favoris = this.favorisProvider.getFavorisList(user.uid).valueChanges();
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
