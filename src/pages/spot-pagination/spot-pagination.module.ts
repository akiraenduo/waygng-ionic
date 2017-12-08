import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotPaginationPage } from './spot-pagination';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SpotPaginationPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotPaginationPage),
    ComponentsModule
  ],
  exports: [
    SpotPaginationPage
  ]
})
export class SpotPaginationPageModule {}
