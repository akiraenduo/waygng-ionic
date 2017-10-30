import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSpotPage } from './add-spot';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';

@NgModule({
  declarations: [
    AddSpotPage
  ],
  imports: [
    IonicPageModule.forChild(AddSpotPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule
  ],
  exports: [
    AddSpotPage
  ]
})
export class AddSpotPageModule { }