import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotDetailPage } from './spot-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SpotDetailPage
  ],
  imports: [
    IonicPageModule.forChild(SpotDetailPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    SpotDetailPage
  ]
})
export class SpotDetailPageModule { }