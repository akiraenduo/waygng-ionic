import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FavorisPage } from './favoris';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';

@NgModule({
  declarations: [
    FavorisPage
  ],
  imports: [
    IonicPageModule.forChild(FavorisPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule
  ],
  exports: [
    FavorisPage
  ]
})
export class FavorisPageModule { }