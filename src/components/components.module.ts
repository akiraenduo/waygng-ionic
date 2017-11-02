import { NgModule } from '@angular/core';
import { MyLoaderComponent } from './my-loader/my-loader';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [MyLoaderComponent],
	imports: [IonicModule],
	exports: [MyLoaderComponent]
})
export class ComponentsModule {}
