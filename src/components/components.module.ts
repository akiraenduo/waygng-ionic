import { NgModule } from '@angular/core';
import { MyLoaderComponent } from './my-loader/my-loader';
import { IonicModule } from 'ionic-angular';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationButtonComponent } from './notification-button/notification-button';
@NgModule({
	declarations: [MyLoaderComponent,
    MyHeaderLoaderComponent,
    NotificationButtonComponent],
	imports: [IonicModule,TranslateModule.forChild(),],
	exports: [MyLoaderComponent,
    MyHeaderLoaderComponent,
    NotificationButtonComponent],

})
export class ComponentsModule {}
