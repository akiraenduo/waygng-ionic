import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FavorisPage } from './favoris';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FavorisPage
  ],
  imports: [
    IonicPageModule.forChild(FavorisPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    FavorisPage
  ]
})
export class FavorisPageModule { }