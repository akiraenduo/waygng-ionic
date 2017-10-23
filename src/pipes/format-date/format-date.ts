import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

/**
 * Generated class for the FormatDatePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(timestamp: number, mode:String) {
    if(timestamp){
      let timestampStr = timestamp.toString().replace("-","");
      timestamp = Number(timestampStr);
      var day = moment(timestamp);
      if(mode == "relative"){
        return day.fromNow();
      }else if(mode == "calendar"){
        return day.calendar();
      }

    }
  }
}
