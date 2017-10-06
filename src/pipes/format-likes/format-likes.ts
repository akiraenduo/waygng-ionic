import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

/**
 * Generated class for the FormatLikesPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatLikes',
})
export class FormatLikesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(likes: object, ...args) {
    if(likes){
      return _.keys(likes).length
    }else{
      return 0;
    }
  }
}
