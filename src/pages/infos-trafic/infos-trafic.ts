import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GinkoProvider } from '../../providers/ginko/ginkoProvider';
import { InfosTrafic } from '../../models/infosTrafic';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the InfosTraficPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-infos-trafic',
  templateUrl: 'infos-trafic.html',
})
export class InfosTraficPage {

  title: any;
  infosTrafic: Observable<InfosTrafic>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public ginkoProvider: GinkoProvider,) {

              this.title = navParams.get("title");

  }

  ionViewDidLoad() {
    this. getInfosTrafic();
  }

  getInfosTrafic(){
    this.infosTrafic = this.ginkoProvider.fetchInfosTrafic();
  }

}
