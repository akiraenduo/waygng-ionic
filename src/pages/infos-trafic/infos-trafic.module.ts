import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { InfosTraficPage } from './infos-trafic';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InfosTraficPage
  ],
  imports: [
    IonicPageModule.forChild(InfosTraficPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    InfosTraficPage
  ]
})
export class InfosTraficPageModule { }