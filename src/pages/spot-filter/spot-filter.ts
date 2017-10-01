import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Hashtag } from '../../models/hashtag';

import { Observable } from 'rxjs/Observable';
import { SpotPage } from '../spot/spot';

/**
 * Generated class for the SpotFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-spot-filter',
  templateUrl: 'spot-filter.html',
})
export class SpotFilterPage {

  @ViewChild('searchBar') searchBar: any; 
  searchHashtag: any = false; 
  hashtags:Observable<any>;
  filterList:Hashtag[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public Keyboard: Keyboard,
              public spotProvider: SpotProvider) {
  }

  ionViewDidLoad() {
    this.doFocus();
  }

  fetchHashtag(hashtag:string){
    this.searchHashtag = true;
    this.hashtags = this.spotProvider.fetchHashtag(hashtag);
  }

  onClear(ev){ 

  }

  getItems(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.fetchHashtag(val);
    }
  }

  doSearch(hashtag){
    this.navCtrl.setRoot(SpotPage, {filter : hashtag.name });
  }

  doFocus(){
    setTimeout(()=>{
      this.searchBar.setFocus();
      this.Keyboard.show();
    },1000);


    this.Keyboard.onKeyboardShow().subscribe((data)=>{
      this.searchBar.setFocus();
    })
  }

}
