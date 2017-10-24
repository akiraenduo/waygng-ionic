import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'

/**
 * Generated class for the FormatColorIconPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatColorIcon',
})
export class FormatColorIconPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(likes: string[], userUid:string) {
    const index = _.indexOf(likes, userUid);
    if(index < 0){
      return 'grey';
    }else{
      return 'blue';
    }
  }
}
