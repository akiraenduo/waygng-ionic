import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth,} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { User } from '../../models/user';
import { HomePage } from '../home/home';
import { Station } from '../../models/station';


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
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
    this.title = navParams.get("title");
  }

  ionViewDidLoad() {
    this.searchFavoris = true;
    this.afAuth.authState.subscribe(user => {
      this.favoris = [];
      if(user && user.uid){
        this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
        const favoris = this.db.list('/users/'+user.uid+'/stations', { preserveSnapshot: true });
        favoris
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.favoris.push(snapshot.val());
            });
            this.searchFavoris = false;
          })
      }
    });
  }

  itemSelected(nomStation){
    let station = new Station("",nomStation,"","");
    this.navCtrl.push(HomePage, {
      station:station
    });

  }

}
