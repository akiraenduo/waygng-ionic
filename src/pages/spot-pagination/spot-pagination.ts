import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaginationService } from '../../providers/spot/paginationService';

/**
 * Generated class for the SpotPaginationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spot-pagination',
  templateUrl: 'spot-pagination.html',
})
export class SpotPaginationPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public page: PaginationService) {

                this.page.init('spots', 'dateUpdate', { reverse: true, prepend: false })
  }

  ionViewDidLoad() {
    
  }

}
