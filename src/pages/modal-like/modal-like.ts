import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Generated class for the ModalLikePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-like',
  templateUrl: 'modal-like.html',
})
export class ModalLikePage {

  usersUid: string[];
  likers= new BehaviorSubject([]);

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public userProvider: UserProvider) {

              this.usersUid = params.get('usersUid');
              this.userProvider.fetchUsers().valueChanges().do(items => {
                if(items.length > 0){
                  let res = [];
                  items.map(item => {
                    const index = _.indexOf(this.usersUid ,item["uid"]);
                    if(index >= 0){
                      res.push(item);
                    }
                  });
                  this.likers.next(res);
                }
              }).subscribe();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
