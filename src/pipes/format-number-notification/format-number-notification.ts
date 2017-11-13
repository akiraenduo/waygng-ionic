import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatNumberNotificationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatNumberNotification',
})
export class FormatNumberNotificationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if(value > 0){
      return value;
    }
  }
}
