import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareFavorisPage } from './share-favoris';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ShareFavorisPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareFavorisPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ShareFavorisPage
  ]
})
export class ShareFavorisPageModule {}
