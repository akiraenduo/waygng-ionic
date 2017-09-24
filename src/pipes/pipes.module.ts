import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
@NgModule({
	declarations: [SafeHtmlPipe],
	imports: [],
	exports: [SafeHtmlPipe]
})
export class PipesModule {}
