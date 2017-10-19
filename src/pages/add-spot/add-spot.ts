import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';

import * as _ from 'lodash';
import { Keyboard } from '@ionic-native/keyboard';
import { SpotPage } from '../spot/spot';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';

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

  @ViewChild('inputMessage') inputMessage: any;  

  isAnonyme:boolean = false;;
  message:string;
  spot: Spot;
  hashtags: Array<any[]>;
  loading:boolean;
  subscription: Subscription;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public spotProvider: SpotProvider,
              public auth: AuthProvider,
              public Keyboard: Keyboard) {

                const userAuth = this.auth.user.subscribe(user => {
                if (user) {
                  this.spot = new Spot(null,user.uid,user.displayName,user.photoURL,new Date().getTime());
                }
                userAuth.unsubscribe();
              });
               
  }

  ionViewDidLoad() {

  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();      
    }
  }

  addSpot(){
    this.spot.message = this.message;
    this.spot.anonyme = this.isAnonyme;
    this.spotProvider.addSpot(this.spot);
    this.navCtrl.setRoot(SpotPage);
  }

  eventInputMessage(ev){
    let value = ev.target.value;
    if(value.length > 0){
     let hashtagList = this.parseHashtagList(value);
     if(hashtagList.length > 0 && _.endsWith(value, hashtagList[hashtagList.length-1])){
      this.loading = true;
      this.subscription = this.spotProvider.fetchHashtag(hashtagList[hashtagList.length-1]).valueChanges().subscribe((hashtags) => {
        this.hashtags = hashtags;
        this.loading = false
      });
     }
    }
  }

  hashtagSelected(tag){
    let hashtagList = this.parseHashtagList(this.message);
    this.message = _.replace(this.message, "#"+hashtagList[hashtagList.length-1], "#"+tag.name);
  }

  parseHashtagList(message):string[]{
    let m, hashtagList =[];
    let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
    while ((m = rx.exec(message)) !== null) {
      if (m[1]) hashtagList.push(m[1]);
    }
    return hashtagList;
  }

}
