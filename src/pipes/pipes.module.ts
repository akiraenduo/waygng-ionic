import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { FormatDatePipe } from './../pipes/format-date/format-date';
@NgModule({
	declarations: [SafeHtmlPipe,
    FormatDatePipe],
	imports: [],
	exports: [SafeHtmlPipe,
    FormatDatePipe]
})
export class PipesModule {}
