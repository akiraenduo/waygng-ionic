import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ShowTwoTimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'showTwoTime',
})
export class ShowTwoTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(lstTemps: string, ...args) {
    if(lstTemps.length == 2){
      return lstTemps[0]+" "+lstTemps[1];
    }else{
      return lstTemps[0]
    }
  }
}
