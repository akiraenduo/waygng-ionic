import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { InfosTrafic } from '../../models/infosTrafic';
import { Observable } from 'rxjs/Observable';
import { TabsUtils } from '../../utils/tabsUtils';

/**
 * Generated class for the InfosTraficPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-infos-trafic',
  templateUrl: 'infos-trafic.html',
})
export class InfosTraficPage {

  infosTrafic: Observable<InfosTrafic>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public ginkoProvider: GinkoProvider,
              public tabsUtils: TabsUtils) {
                this.tabsUtils.show();

  }

  goProfile(){
    this.navCtrl.push('ProfilePage');
  }

  ionViewDidLoad() {
    this.getInfosTrafic();
  }

  getInfosTrafic(){
    this.infosTrafic = this.ginkoProvider.fetchInfosTrafic();
  }

}
