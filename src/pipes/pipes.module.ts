import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './../pipes/safe-html/safe-html';
import { ShowTwoTimePipe } from './show-two-time/show-two-time';
import { FormatDatePipe } from './../pipes/format-date/format-date';
import { FormatHashtagPipe } from './../pipes/format-hashtag/format-hashtag';
import { FormatLikesPipe } from './format-likes/format-likes';
import { FormatLikeIconPipe } from './format-like-icon/format-like-icon';
import { RemoveDuplicateStationPipe } from './remove-duplicate-station/remove-duplicate-station';
import { CalculateDistancePipe } from './calculate-distance/calculate-distance';
import { FormatColorIconPipe } from './format-color-icon/format-color-icon';
import { FormatBackgroundNotifPipe } from './format-background-notif/format-background-notif';
import { FormatNumberNotificationPipe } from './format-number-notification/format-number-notification';
import { FormatTypeNotificationPipe } from './format-type-notification/format-type-notification';
import { FormatCommentsPipe } from './format-comments/format-comments';
@NgModule({
    declarations: [SafeHtmlPipe,
    ShowTwoTimePipe,
    CalculateDistancePipe,    
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe,
    FormatColorIconPipe,
    FormatBackgroundNotifPipe,
    FormatNumberNotificationPipe,
    FormatTypeNotificationPipe,
    FormatCommentsPipe],
	imports: [],
    exports: [SafeHtmlPipe,
    ShowTwoTimePipe,
    CalculateDistancePipe,     
    RemoveDuplicateStationPipe,
    FormatDatePipe,
    FormatHashtagPipe,
    FormatLikesPipe,
    FormatLikeIconPipe,
    FormatColorIconPipe,
    FormatBackgroundNotifPipe,
    FormatNumberNotificationPipe,
    FormatTypeNotificationPipe,
    FormatCommentsPipe]
})
export class PipesModule {}
