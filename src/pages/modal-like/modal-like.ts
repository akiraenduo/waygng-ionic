import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/userProvider';
import { Observable } from 'rxjs/Observable';

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
  likers: Observable<any[]>;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public userProvider: UserProvider) {

              this.usersUid = params.get('usersUid');
              this.likers = this.userProvider.fetchUsers(this.usersUid).valueChanges();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
