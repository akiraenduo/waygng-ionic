import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterStationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterStation',
})
export class FilterStationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(stations: any[], name:string) {
    if(name){
      return stations.filter((station) => {
        return (station.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
      })
    }else{
      return stations;
    }

  }
}
