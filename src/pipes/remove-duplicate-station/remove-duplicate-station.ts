import { Pipe, PipeTransform } from '@angular/core';
import { Station } from '../../models/station';

import * as _ from 'lodash';

/**
 * Generated class for the RemoveDuplicateStationPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'removeDuplicateStation',
})
export class RemoveDuplicateStationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(stations: Station[], ...args) {
    return _.uniqWith(stations, function(first, second){
      return first.name === second.name;
    });
  }
}
