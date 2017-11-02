import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSpotPage } from './add-spot';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddSpotPage
  ],
  imports: [
    IonicPageModule.forChild(AddSpotPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    AddSpotPage
  ]
})
export class AddSpotPageModule { }