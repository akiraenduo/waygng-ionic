import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLikePage } from './modal-like';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ModalLikePage
  ],
  imports: [
    IonicPageModule.forChild(ModalLikePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ModalLikePage
  ]
})
export class ModalLikePageModule { }