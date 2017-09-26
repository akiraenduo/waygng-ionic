import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { User } from '../../models/user';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Hashtag } from '../../models/hashtag';

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
  hashtags: Hashtag[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public spotProvider: SpotProvider) {

               this.user = this.userProvider.getUser();
               this.spot = new Spot("","","",new Date().getTime(),"");
               this.hashtags = [];
  }

  ionViewDidLoad() {

  }

  addSpot(){
    this.spot.userUid = this.user.uid;
    this.spot.dateUpdate = new Date().getTime();
    this.spotProvider.addSpot(this.spot);
    this.navCtrl.pop();
  }

  eventInputMessage(){
    this.hashtags = [];
    if(this.spot.message.length > 0){
      let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
      let m, hashtagList =[];
      while ((m = rx.exec(this.spot.message)) !== null) {
        if (m[1]) hashtagList.push(m[1]);
     }
     if(hashtagList.length > 0){
      console.log("param "+hashtagList[hashtagList.length-1]);
      const fetch = this.spotProvider.fetchHashtag(hashtagList[hashtagList.length-1]);
      const sub = fetch.subscribe(tags =>{
        tags.forEach(tag =>{
          console.log("res "+tag.val().name);
          this.hashtags.push(new Hashtag(tag.val().name,null))
        })
        sub.unsubscribe();
      })

     }
    }
    
  }

}
