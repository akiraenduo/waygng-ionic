import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

//MODULE NATIF
import { Geolocation } from '@ionic-native/geolocation';

// PAGE
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {RealTimePage} from '../pages/real-time/real-time';
import {StationSearchPage} from '../pages/station-search/station-search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GinkoProvider } from '../providers/ginko/ginkoProvider';
import { HttpModule,JsonpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RealTimePage,
    StationSearchPage
  ],
  imports: [
    HttpModule,
    JsonpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RealTimePage,
    StationSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GinkoProvider
  ]
})
export class AppModule {}