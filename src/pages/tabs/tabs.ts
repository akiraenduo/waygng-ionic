import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { Tab4Root } from '../pages';
import { Tab5Root } from '../pages';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  notificationNotSaw:number;

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";
  tab5Title = " ";

  constructor(public navCtrl: NavController, 
              public translateService: TranslateService,
              public auth: AuthProvider) {
    this.auth.user.subscribe(user => {
        if(user){
          this.notificationNotSaw = user.notificationNotSaw;
        }
    });
    translateService.get(['MENU.TIMETABLE', 'MENU.TRAFFIC_INFO', 'MENU.MAP', 'MENU.SPOTS', 'MENU.NOTIFICATIONS']).subscribe(values => {
      this.tab1Title = values['MENU.TIMETABLE'];
      this.tab2Title = values['MENU.TRAFFIC_INFO'];
      this.tab3Title = values['MENU.MAP'];
      this.tab4Title = values['MENU.SPOTS'];
      this.tab5Title = values['MENU.NOTIFICATIONS'];
    });
  }
}