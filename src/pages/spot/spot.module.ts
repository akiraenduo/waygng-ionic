import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotPage } from './spot';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SpotPage
  ],
  imports: [
    IonicPageModule.forChild(SpotPage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule
  ],
  exports: [
    SpotPage
  ]
})
export class SpotPageModule { }