import { NgModule } from '@angular/core';
import { MyLoaderComponent } from './my-loader/my-loader';
import { IonicModule } from 'ionic-angular';
import { MyHeaderLoaderComponent } from './my-header-loader/my-header-loader';
import { LoginButtonComponent } from './login-button/login-button';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
	declarations: [MyLoaderComponent,
    MyHeaderLoaderComponent,
    LoginButtonComponent],
	imports: [IonicModule,TranslateModule.forChild(),],
	exports: [MyLoaderComponent,
    MyHeaderLoaderComponent,
    LoginButtonComponent],

})
export class ComponentsModule {}
