import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';

import * as _ from 'lodash';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the AddSpotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-spot',
  templateUrl: 'add-spot.html',
})
export class AddSpotPage {

  isAnonyme:boolean = false;;
  message:string;
  hashtags: Array<any[]>;
  loading:boolean;
  subscription: Subscription;
  user:any;
  spot:Spot;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public spotProvider: SpotProvider,
              public auth: AuthProvider,
              public toastCtrl: ToastController) {

                this.spot = this.navParams.get("spot");
                if(this.spot){
                  this.isAnonyme = this.spot.anonyme;
                  this.message = this.spot.message;
                }

                const userAuth = this.auth.user.subscribe(user => {
                if (user) {
                  this.user = user;
                }
                userAuth.unsubscribe();
              });
               
  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();      
    }
  }

  addSpot(){

    if(!this.spot){
      const spot: Spot = {
        message: this.message,
        dateUpdate: new Date().getTime(),
        userUid: this.user.uid,
        userName: this.user.displayName,
        userPicture: this.user.photoURL,
        anonyme:this.isAnonyme
      }

      this.spotProvider.addSpot(spot);
      this.navCtrl.setRoot('SpotPage')
      this.toastCtrl.create({
        message: 'Spot ajouté !',
        duration: 3000,
        position: 'bottom'
      }).present();
    }else{
      this.spot.message = this.message;
      this.spot.anonyme = this.isAnonyme;
      this.spotProvider.updateSpot(this.spot);
      this.navCtrl.setRoot('SpotPage')
      this.toastCtrl.create({
        message: 'Mise à jour du spot !',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  
  }

  eventInputMessage(ev){
    let value = ev.target.value;
    if(value.length > 0){
     let hashtagList = this.parseHashtagList(value);
     if(hashtagList.length > 0 && _.endsWith(value, hashtagList[hashtagList.length-1])){
      this.loading = true;
      this.subscription = this.spotProvider.fetchHashtag(hashtagList[hashtagList.length-1]).valueChanges().subscribe((hashtags) => {
        this.hashtags = hashtags;
        this.loading = false;
      });
     }
    }
  }

  hashtagSelected(tag){
    let hashtagList = this.parseHashtagList(this.message);
    this.message = _.replace(this.message, "#"+hashtagList[hashtagList.length-1], "#"+tag.tag);
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
