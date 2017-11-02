import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { StationSearchPage } from './station-search';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    StationSearchPage
  ],
  imports: [
    IonicPageModule.forChild(StationSearchPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    StationSearchPage
  ]
})
export class StationSearchPageModule { }