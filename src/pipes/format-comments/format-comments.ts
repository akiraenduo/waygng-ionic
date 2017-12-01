import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatCommentsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatComments',
})
export class FormatCommentsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(count: number) {
    if( count && count > 0){
      return count + " commentaires";
    }else{
      return "0 commentaire";
    }
  }
}
