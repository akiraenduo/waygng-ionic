import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsPage } from './tabs';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class TabsPageModule {}
