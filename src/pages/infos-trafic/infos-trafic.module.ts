import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { InfosTraficPage } from './infos-trafic';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';

@NgModule({
  declarations: [
    InfosTraficPage
  ],
  imports: [
    IonicPageModule.forChild(InfosTraficPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule
  ],
  exports: [
    InfosTraficPage
  ]
})
export class InfosTraficPageModule { }