import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild(),
    MyLoaderComponentModule,
    PipesModule
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfilePageModule { }