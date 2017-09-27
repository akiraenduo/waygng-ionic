import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { User } from '../../models/user';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { FirebaseListObservable } from 'angularfire2/database';

import * as _ from 'lodash';

/**
 * Generated class for the AddSpotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-spot',
  templateUrl: 'add-spot.html',
})
export class AddSpotPage {

  user: User;
  spot: Spot;
  hashtags: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public spotProvider: SpotProvider) {

               this.user = this.userProvider.getUser();
               this.spot = new Spot("","","",new Date().getTime(),"");
  }

  ionViewDidLoad() {

  }

  addSpot(){
    this.spot.userUid = this.user.uid;
    this.spot.dateUpdate = new Date().getTime();
    this.spotProvider.addSpot(this.spot);
    this.navCtrl.pop();
  }

  eventInputMessage(ev){
    let value = ev.target.value;
    if(value.length > 0){
      let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
      let m, hashtagList =[];
      while ((m = rx.exec(value)) !== null) {
        if (m[1]) hashtagList.push(m[1]);
      }
     if(hashtagList.length > 0){
      this.hashtags = this.spotProvider.fetchHashtag(hashtagList[hashtagList.length-1]);
     }
    }
  }

  hashtagSelected(tag){
    let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
    let m, hashtagList =[];
    while ((m = rx.exec(this.spot.message)) !== null) {
      if (m[1]) hashtagList.push(m[1]);
    }

    this.spot.message = _.replace(this.spot.message, "#"+hashtagList[hashtagList.length-1], "#"+tag.name);
  }

}
