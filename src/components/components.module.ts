import { NgModule } from '@angular/core';
import { MyLoaderComponent } from './my-loader/my-loader';
import { IonicModule } from 'ionic-angular';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
	declarations: [MyLoaderComponent,
    MyHeaderLoaderComponent],
	imports: [IonicModule,TranslateModule.forChild(),],
	exports: [MyLoaderComponent,
    MyHeaderLoaderComponent],

})
export class ComponentsModule {}
