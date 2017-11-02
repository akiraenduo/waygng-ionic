import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatBackgroundNotifPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatBackgroundNotif',
})
export class FormatBackgroundNotifPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(read: boolean, ...args) {
    if(read){
      return "background-notification-read border-bottom item item-block item-ios";
    }
    return "background-notification-noRead border-bottom item item-block item-ios";
    
  }
}
