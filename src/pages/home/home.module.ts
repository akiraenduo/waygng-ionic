import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { ShowTwoTimePipe } from '../../pipes/show-two-time/show-two-time';

@NgModule({
  declarations: [
    HomePage,
    ShowTwoTimePipe
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
    MyLoaderComponentModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule { }