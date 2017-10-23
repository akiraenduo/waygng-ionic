import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLikePage } from './modal-like';
import { MyLoaderComponentModule } from '../../components/my-loader/my-loader.module';

@NgModule({
  declarations: [
    ModalLikePage
  ],
  imports: [
    IonicPageModule.forChild(ModalLikePage),
    TranslateModule.forChild(),
    MyLoaderComponentModule
  ],
  exports: [
    ModalLikePage
  ]
})
export class ModalLikePageModule { }