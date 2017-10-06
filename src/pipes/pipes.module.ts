import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { FormatDatePipe } from './../pipes/format-date/format-date';
import { FormatHashtagPipe } from './../pipes/format-hashtag/format-hashtag';
import { SortSpotsPipe } from './sort-spots/sort-spots';
import { FormatLikesPipe } from './format-likes/format-likes';
@NgModule({
	declarations: [SafeHtmlPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    SortSpotsPipe,
    FormatLikesPipe],
	imports: [],
	exports: [SafeHtmlPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    SortSpotsPipe,
    FormatLikesPipe]
})
export class PipesModule {}
