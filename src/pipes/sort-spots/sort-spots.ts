import { Pipe, PipeTransform } from '@angular/core';
import { Spot } from '../../models/spot';

/**
 * Generated class for the SortSpotsPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'sortSpots',
})
export class SortSpotsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(spots: Spot[], ...args) {

   return spots.reverse();;

  }
}
