import { Component } from '@angular/core';

import { FavorisPage } from '../favoris/favoris';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { SpotPage } from '../spot/spot';
import { NotificationPage } from '../notification/notification';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FavorisPage;
  tab3Root = MapPage;
  tab4Root = SpotPage;
  tab5Root = NotificationPage;

  constructor() {

  }
}