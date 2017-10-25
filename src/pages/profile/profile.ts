import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Subscription } from 'rxjs/Subscription';
import spotUtils from '../spot/spotUtils'

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loading: any;
  user:any;
  mySpots:Array<any>;
  subscription: Subscription;
  userUid:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public spotProvider: SpotProvider ) {

                const userAuth = this.auth.user.subscribe(user => {
                  if(user){
                    this.loading = true;
                    this.user = user;
                    this.userUid = user.uid;
                    this.subscription = spotProvider.getSpotsForCurrentUser(user.uid).valueChanges().subscribe(spots => {
                      this.mySpots = spots;
                      this.loading = false;
                    })
                  }
                  userAuth.unsubscribe();
                });
                

  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  incrementLike(spot){
    spotUtils.incrementLike(spot,this.userUid);
    this.spotProvider.incrementLikes(spot.id,spot);
  }
  
  removeSpot(spot){
    this.spotProvider.removeSpot(spot.id);
  }

  logout() {
    this.navCtrl.setRoot(HomePage); 
    this.auth.logout();
  }

}
