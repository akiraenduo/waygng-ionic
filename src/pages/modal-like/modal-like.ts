import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import * as _ from 'lodash'
import { Subscription } from 'rxjs/Subscription';

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
  users: any;
  likers: Array<any[]>;
  subscription: Subscription;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public userProvider: UserProvider) {

              this.usersUid = params.get('usersUid');

           this.subscription = this.userProvider.fetchUsers().valueChanges().subscribe(users => {
                this.users = users;
                this.applyFilters();
              })

  }

  private applyFilters() {
    var self = this;
   this.likers = _.filter(this.users, function(user) {
       const index = _.indexOf(self.usersUid ,user.uid);
       if(index >= 0){
          return true; 
       }
       return false;
    });
  }
 
  dismiss() {
    this.subscription.unsubscribe();
    this.viewCtrl.dismiss();
  }

}
