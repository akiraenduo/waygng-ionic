import { NgModule } from '@angular/core';
import { MyLoaderComponent } from './my-loader/my-loader';
import { IonicModule } from 'ionic-angular';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader';
@NgModule({
	declarations: [MyLoaderComponent,
    MyHeaderLoaderComponent],
	imports: [IonicModule],
	exports: [MyLoaderComponent,
    MyHeaderLoaderComponent]
})
export class ComponentsModule {}
