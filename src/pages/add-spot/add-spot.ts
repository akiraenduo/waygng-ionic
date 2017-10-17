import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';

import * as _ from 'lodash';
import { Keyboard } from '@ionic-native/keyboard';
import { SpotPage } from '../spot/spot';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';

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
  hashtags: Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public spotProvider: SpotProvider,
              public auth: AuthProvider,
              public Keyboard: Keyboard) {

              this.auth.user.subscribe(user => {
                if (user) {
                  this.spot = new Spot(null,user.uid,user.displayName,user.photoURL,new Date().getTime());
                }
              });
               
  }

  ionViewDidLoad() {

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
      this.hashtags = this.spotProvider.fetchHashtag(hashtagList[hashtagList.length-1]).valueChanges();
     }
    }
  }

  hashtagSelected(tag){
    let hashtagList = this.parseHashtagList(this.spot.message);
    this.spot.message = _.replace(this.spot.message, "#"+hashtagList[hashtagList.length-1], "#"+tag.name);
    this.doFocus();
  }

  parseHashtagList(message):string[]{
    let m, hashtagList =[];
    let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
    while ((m = rx.exec(message)) !== null) {
      if (m[1]) hashtagList.push(m[1]);
    }
    return hashtagList;
  }

  doFocus(){
    setTimeout(()=>{
      this.inputMessage.setFocus();
      this.Keyboard.show();
    },500);
    this.Keyboard.onKeyboardShow().subscribe((data)=>{
      this.inputMessage.setFocus();
    })
  }

}
