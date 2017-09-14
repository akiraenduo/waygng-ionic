import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Observable } from 'rxjs/Observable';

import {RealTimePage} from '../real-time/real-time';
import {StationSearchPage} from '../station-search/station-search';

import { Station } from '../../object/station';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {


  public title;
  errorMessage: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.title = navParams.get("title");
    if(!this.title){
      this.title = "Home";
    }
  }

  ionViewDidLoad() {

  }


  searchStation(){
    this.navCtrl.push(StationSearchPage);
  }
  

}
