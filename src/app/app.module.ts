import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// ANGULAR FIRE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//MODULE NATIF
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook } from '@ionic-native/facebook';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { FCM } from '@ionic-native/fcm';

// MY COMPONENT
import {MyLoaderComponent} from '../components/my-loader/my-loader'

//PIPE
import {RemoveDuplicateStationPipe} from '../pipes/remove-duplicate-station/remove-duplicate-station';
import {CalculateDistancePipe} from '../pipes/calculate-distance/calculate-distance';
import {ShowTwoTimePipe} from '../pipes/show-two-time/show-two-time';
import {SafeHtmlPipe} from '../pipes/safe-html/safe-html';
import {FormatDatePipe} from '../pipes/format-date/format-date';
import {FormatHashtagPipe} from '../pipes/format-hashtag/format-hashtag';
import {SortSpotsPipe} from '../pipes/sort-spots/sort-spots';
import {FormatLikesPipe} from '../pipes/format-likes/format-likes';

// PAGE
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import {StationSearchPage} from '../pages/station-search/station-search';
import {FavorisPage} from '../pages/favoris/favoris';
import {InfosTraficPage} from '../pages/infos-trafic/infos-trafic';
import {ProfilePage} from '../pages/profile/profile';
import {SpotPage} from '../pages/spot/spot';
import {AddSpotPage} from '../pages/add-spot/add-spot';
import {SpotFilterPage} from '../pages/spot-filter/spot-filter';
import {SpotDetailPage} from '../pages/spot-detail/spot-detail';

//PROVIDER
import { GinkoProvider } from '../providers/ginko/ginkoProvider';
import { UserProvider } from '../providers/user/userProvider';
import { FavorisProvider } from '../providers/favoris/favorisProvider';
import { SpotProvider } from '../providers/spot/spotProvider';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule,JsonpModule } from '@angular/http';
import { FIREBASE_CONFIG } from './app.firebase.config';




@NgModule({
  declarations: [
    MyApp,
    MyLoaderComponent,
    HomePage,
    LoginPage,
    RegisterPage,
    StationSearchPage,
    FavorisPage,
    InfosTraficPage,
    ProfilePage,
    SpotPage,
    AddSpotPage,
    SpotFilterPage,
    SpotDetailPage,
    RemoveDuplicateStationPipe,
    CalculateDistancePipe,
    ShowTwoTimePipe,
    SafeHtmlPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    SortSpotsPipe,
    FormatLikesPipe
  ],
  imports: [
    HttpModule,
    JsonpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      iconMode: 'ios',
      pageTransition: 'ios-transition'
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    StationSearchPage,
    FavorisPage,
    InfosTraficPage,
    ProfilePage,
    SpotPage,
    AddSpotPage,
    SpotFilterPage,
    SpotDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Keyboard,
    Facebook,
    PhotoLibrary,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GinkoProvider,
    UserProvider,
    FavorisProvider,
    SpotProvider
  ]
})
export class AppModule {}
