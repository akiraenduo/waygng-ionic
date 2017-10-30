import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule
  ],
  exports: [
    NotificationPage
  ]
})
export class NotificationPageModule {}
