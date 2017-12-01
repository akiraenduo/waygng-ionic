import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareFavorisPage } from './share-favoris';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ShareFavorisPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareFavorisPage),
    TranslateModule.forChild(),
  ],
  exports: [
    ShareFavorisPage
  ]
})
export class ShareFavorisPageModule {}
