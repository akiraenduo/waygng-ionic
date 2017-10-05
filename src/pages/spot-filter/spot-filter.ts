import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SpotProvider } from '../../providers/spot/spotProvider';
import { Hashtag } from '../../models/hashtag';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as _ from 'lodash'
import { UserProvider } from '../../providers/user/userProvider';
import { AngularFireAuth } from 'angularfire2/auth';

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
  searchBarVal: string;
  hashtags:Observable<any>;
  filterList:Hashtag[] = [];
  hashtagKeySelected: any;
  searchBarModel: string;

  searchSpots: any;
  spotsFiltered = new BehaviorSubject([]);
  batch = 15        // size of each query
  finished = false  // boolean when end of database is reached
  userUid: any;

  lastKey = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public Keyboard: Keyboard,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider,
              private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userUid = user.uid;
      }else{
        this.userUid = null;
      }
    });
    this.doFocus();
  }

  fetchHashtag(hashtag:string){
    this.hashtags = this.spotProvider.fetchHashtag(hashtag);
  }

  onClear(ev){ 
    this.hashtagKeySelected = null;
    this.lastKey = null;
    this.spotsFiltered = new BehaviorSubject([]);
  } 

  clearSearchBar(){
    this.searchBarModel = null;
    this.searchBarVal = null;
    this.hashtagKeySelected = null;
    this.lastKey = null;
    this.spotsFiltered = new BehaviorSubject([]);
  }

  onClickSearchBar(){
    if(this.hashtagKeySelected != null){

    }
  }

  getItems(ev) {
    // set val to the value of the ev target
    this.searchBarVal = ev.target.value;

    // if the value is an empty string don't filter the items
    if (this.searchBarVal && this.searchBarVal.trim() != '') {
      this.fetchHashtag(this.searchBarVal);
    }
  }

  doSearch(hashtag){
    this.finished = false;
    this.searchBarModel = hashtag.name;
    this.hashtagKeySelected = hashtag.$key;
    this.userProvider.addHistoryHashtag(this.userUid,this.hashtagKeySelected);
    this.getSpotsFiltered(null);
  }

  doInfinite(infiniteScroll) {
    if(this.hashtagKeySelected){
      this.getSpotsFiltered(infiniteScroll);
    }
  }


  private getSpotsFiltered(infiniteScroll){
    if (this.finished){
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return
    } 
    const getSpotList = this.spotProvider.fetchSpots(this.hashtagKeySelected,this.lastKey,this.batch+1).do(item => {
      let lastSpot = _.last(item.spots);
      this.lastKey = lastSpot.$ref.key;

      const newSpots = _.slice(item.spots, 0, this.batch);
      const currentSpots = this.spotsFiltered.getValue();
      let lastNewSpot = _.last(newSpots);

      if (this.lastKey == lastNewSpot.$ref.key) {
        this.finished = true
      }
      this.spotsFiltered.next(_.concat(currentSpots,newSpots));
    });
    if(infiniteScroll){
      getSpotList.subscribe(() => infiniteScroll.complete())
    }else{
      getSpotList.subscribe(() => {
        this.searchSpots = false
      });
    }
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
