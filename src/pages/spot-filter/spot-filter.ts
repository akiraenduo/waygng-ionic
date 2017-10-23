import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SpotProvider } from '../../providers/spot/spotProvider';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as _ from 'lodash'
import { UserProvider } from '../../providers/user/userProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { SpotDetailPage } from '../spot-detail/spot-detail';
import { Subscription } from 'rxjs/Subscription';

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
  hashtags:Observable<any>;
  hashtagsHistory:any = [];
  hashtagKeySelected: any;
  searchBarModel: string;

  loading: any;
  spotsFiltered = new BehaviorSubject([]);
  batch = 15        // size of each query
  finished = false  // boolean when end of database is reached
  userUid: any;
  isHistorySearch: boolean = false;
  subscription: Subscription;

  lastKey = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public Keyboard: Keyboard,
              public spotProvider: SpotProvider,
              public userProvider: UserProvider,
              private auth: AuthProvider) {

                this.loading = true;
                const userAuth = this.auth.user.subscribe(user => {
                  if (user) {
                    this.userUid = user.uid;
                    this.isHistorySearch = true;
                    this.getHistoryHashtags(this.userUid);
                  }else{
                    this.userUid = null;
                  }
                  userAuth.unsubscribe();
                });
                this.doFocus();
                
  }

  ionViewDidLoad() {

  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  getHistoryHashtags(userUid:string){
    this.loading = true;
    this.hashtagsHistory = [];
    this.hashtags = this.userProvider.getHistoryHashtags(userUid).snapshotChanges().map(hashtagsHisto => {
      return hashtagsHisto.map(h => {
        const data = h.payload.doc.data();
        const id = h.payload.doc.id;
        this.hashtagsHistory.push({ id, ...data });
        return { id, ...data };
      });
    }).do(hashtagsHisto => {
      this.loading = false;
    })
  }

  fetchHashtag(hashtag:string){
    this.hashtags = this.spotProvider.fetchHashtag(hashtag.toLowerCase()).snapshotChanges().map(hashtags => {
      return hashtags.map(h => {
        const data = h.payload.doc.data();
        const id = h.payload.doc.id;
        return { id, ...data };
      });
    })
  }

  clearSearchBar(){
    this.searchBarModel = null;
    this.hashtagKeySelected = null;
    this.lastKey = null;
    this.spotsFiltered = new BehaviorSubject([]);
    this.isHistorySearch = true;
    this.getHistoryHashtags(this.userUid);
  }

  onClickSearchBar(){
    if(this.hashtagKeySelected != null){
      this.hashtagKeySelected = null;
      this.searchBarModel = null;
      this.isHistorySearch = true;
      this.getHistoryHashtags(this.userUid);
    }
  }

  getItems(ev) {
    this.loading = false;
    this.isHistorySearch = false;
    // set val to the value of the ev target
    let value = ev.target.value;

    // if the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      this.fetchHashtag(value);
    }else{
      this.clearSearchBar();
    }
  }

  doSearch(hashtag){
    this.finished = false;
    this.searchBarModel = hashtag.name;
    this.hashtagKeySelected = hashtag.id;
    this.lastKey = null;
    this.spotsFiltered = new BehaviorSubject([]);

    if(this.hashtagsHistory.length >= 4 && !_.find(this.hashtagsHistory, {'id':this.hashtagKeySelected})){
     const lastHistoryTag = _.last(this.hashtagsHistory);
     this.userProvider.removeHistoryHashtag(this.userUid,lastHistoryTag.id);
    }


    this.userProvider.addHistoryHashtag(this.userUid,this.hashtagKeySelected,this.searchBarModel);
    this.getSpotsFiltered(null);
  }

  doInfinite(infiniteScroll) {
    if(this.hashtagKeySelected){
      this.getSpotsFiltered(infiniteScroll);
    }
  }


  private getSpotsFiltered(infiniteScroll){
    this.loading = true;
    if (this.finished){
      this.loading = false;
      if(infiniteScroll){
        infiniteScroll.complete();
      }
      return
    } 
    const getSpotList = this.spotProvider.fetchSpots(this.hashtagKeySelected,this.lastKey,this.batch+1).do(item => {
      let lastSpot = _.last(item.spots);
      this.lastKey = lastSpot.ref.id;

      const newSpots = _.slice(item.spots, 0, this.batch);
      const currentSpots = this.spotsFiltered.getValue();
      let lastNewSpot = _.last(newSpots);

      if (this.lastKey == lastNewSpot.ref.id) {
        this.finished = true
      }
      const newSpotList = _.map(newSpots,"spot");
      this.spotsFiltered.next(_.concat(currentSpots,newSpotList));
    });
    if(infiniteScroll){
      this.subscription = getSpotList.subscribe(() => {
        this.loading = false;
        infiniteScroll.complete();
      })
    }else{
      this.subscription = getSpotList.subscribe(() => {
        this.loading = false;
      });
    }
  }

  goDetailSpot(event){
    let spotId = event.currentTarget.id;
    this.navCtrl.push(SpotDetailPage, {spotKey : spotId});
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
