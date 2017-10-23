import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { FormatDatePipe } from './../pipes/format-date/format-date';
import { FormatHashtagPipe } from './../pipes/format-hashtag/format-hashtag';
import { FormatLikesPipe } from './format-likes/format-likes';
import { FormatLikeIconPipe } from './format-like-icon/format-like-icon';
import { RemoveDuplicateStationPipe } from './remove-duplicate-station/remove-duplicate-station';
import { CalculateDistancePipe } from './calculate-distance/calculate-distance';
@NgModule({
    declarations: [SafeHtmlPipe,
    CalculateDistancePipe,    
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe],
	imports: [],
    exports: [SafeHtmlPipe,
    CalculateDistancePipe,     
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe]
})
export class PipesModule {}
