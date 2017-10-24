import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { FormatDatePipe } from './../pipes/format-date/format-date';
import { FormatHashtagPipe } from './../pipes/format-hashtag/format-hashtag';
import { FormatLikesPipe } from './format-likes/format-likes';
import { FormatLikeIconPipe } from './format-like-icon/format-like-icon';
import { RemoveDuplicateStationPipe } from './remove-duplicate-station/remove-duplicate-station';
import { CalculateDistancePipe } from './calculate-distance/calculate-distance';
import { FormatColorIconPipe } from './format-color-icon/format-color-icon';
@NgModule({
    declarations: [SafeHtmlPipe,
    CalculateDistancePipe,    
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe,
    FormatColorIconPipe],
	imports: [],
    exports: [SafeHtmlPipe,
    CalculateDistancePipe,     
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe,
    FormatColorIconPipe]
})
export class PipesModule {}
