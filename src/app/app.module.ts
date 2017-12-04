import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// ANGULAR FIRE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//MODULE NATIF
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook } from '@ionic-native/facebook';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { FCM } from '@ionic-native/fcm';
import { Badge } from '@ionic-native/badge';
import { GoogleMaps }  from '@ionic-native/google-maps';
import { IonicStorageModule } from '@ionic/storage';
import { Globalization } from '@ionic-native/globalization';


// PAGE
import { MyApp } from './app.component';

//PROVIDER
import { AuthProvider } from '../providers/auth/auth';
import { GinkoProvider } from '../providers/ginko/ginkoProvider';
import { UserProvider } from '../providers/user/userProvider';
import { FavorisProvider } from '../providers/favoris/favorisProvider';
import { SpotProvider } from '../providers/spot/spotProvider';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}




@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    JsonpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      iconMode: 'ios',
      pageTransition: 'ios-transition'
    }),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Keyboard,
    Facebook,
    PhotoLibrary,
    FCM,
    Badge,
    GoogleMaps,
    Globalization,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GinkoProvider,
    UserProvider,
    FavorisProvider,
    SpotProvider,
    AuthProvider
  ]
})
export class AppModule {}
