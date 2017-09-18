import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth,} from 'angularfire2/auth';
import { AngularFireDatabase,FirebaseListObservable } from 'angularfire2/database';

import { User } from '../../models/user';


@Component({
  selector: 'page-favoris',
  templateUrl: 'favoris.html',
})
export class FavorisPage {

  title: any;
  userData: User;
  favoris: FirebaseListObservable<any>;
  items: string[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
    this.title = navParams.get("title");
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(user => {
      if(user && user.uid){
        this.userData = new User(user.uid,user.email,"",user.displayName,user.photoURL);
        const favoris = this.db.list('/users/'+user.uid+'/stations', { preserveSnapshot: true });
        favoris
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.items.push(snapshot.val());
            });
          })
      }
    });
  }

}
