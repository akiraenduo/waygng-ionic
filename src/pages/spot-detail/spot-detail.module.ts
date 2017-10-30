import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotDetailPage } from './spot-detail';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SpotDetailPage
  ],
  imports: [
    IonicPageModule.forChild(SpotDetailPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule
  ],
  exports: [
    SpotDetailPage
  ]
})
export class SpotDetailPageModule { }