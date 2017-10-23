import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotFilterPage } from './spot-filter';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';


//PIPE
import {FormatHashtagPipe} from '../../pipes/format-hashtag/format-hashtag';

@NgModule({
  declarations: [
    SpotFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotFilterPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule

  ],
  exports: [
    SpotFilterPage
  ]
})
export class SpotFilterPageModule { }