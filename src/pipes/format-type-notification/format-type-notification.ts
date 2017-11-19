import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatTypeNotificationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatTypeNotification',
})
export class FormatTypeNotificationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(type: string) {
    if(type == "LIKE"){
      return "NOTIF_LIKE_SPOT";
    }
    return "NOTIF_COMMENT_SPOT";
  }
}
