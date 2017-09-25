import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { User } from '../../models/user';
import { Spot } from '../../models/spot';
import { SpotProvider } from '../../providers/spot/spotProvider';

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

}
