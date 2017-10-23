import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loading: any;
  user:any;
  mySpots:Array<any>;
  subscription: Subscription;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider,
              public spotProvider: SpotProvider ) {

                const userAuth = this.auth.user.subscribe(user => {
                  if(user){
                    this.loading = true;
                    this.user = user;
                    this.subscription = spotProvider.getSpotsForCurrentUser(user.uid).valueChanges().subscribe(spots => {
                      this.mySpots = spots;
                      this.loading = false;
                    })
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


  logout() {
    this.navCtrl.setRoot(HomePage); 
    this.auth.logout();
  }

}
