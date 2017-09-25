import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SpotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-spot',
  templateUrl: 'spot.html',
})
export class SpotPage {

  title:any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = navParams.get("title");
  }

  ionViewDidLoad() {

  }

  addSpot(){

  }

}
