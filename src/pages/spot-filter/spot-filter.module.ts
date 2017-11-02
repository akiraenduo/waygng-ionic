import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotFilterPage } from './spot-filter';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    SpotFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotFilterPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule

  ],
  exports: [
    SpotFilterPage
  ]
})
export class SpotFilterPageModule { }