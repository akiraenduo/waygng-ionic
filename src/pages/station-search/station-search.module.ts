import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { StationSearchPage } from './station-search';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    StationSearchPage
  ],
  imports: [
    IonicPageModule.forChild(StationSearchPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule
  ],
  exports: [
    StationSearchPage
  ]
})
export class StationSearchPageModule { }