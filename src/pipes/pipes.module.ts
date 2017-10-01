import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { FormatDatePipe } from './../pipes/format-date/format-date';
import { FormatHashtagPipe } from './../pipes/format-hashtag/format-hashtag';
@NgModule({
	declarations: [SafeHtmlPipe,
    FormatDatePipe,
    FormatHashtagPipe],
	imports: [],
	exports: [SafeHtmlPipe,
    FormatDatePipe,
    FormatHashtagPipe]
})
export class PipesModule {}
