import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the SpotDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-spot-detail',
  templateUrl: 'spot-detail.html',
})
export class SpotDetailPage {

  spot:Observable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public spotProvider: SpotProvider) {

              let spotKey = navParams.get("spotKey");
              this.spot = spotProvider.getSpot(spotKey);
  }

  ionViewDidLoad() {
  
  }

}
