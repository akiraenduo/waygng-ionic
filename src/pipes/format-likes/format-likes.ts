import { Pipe, PipeTransform } from '@angular/core';
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
  transform(likes: string[]) {
    if(likes){
      if(likes.length > 1){
        return likes.length+" J'aimes";
      }else{
        return likes.length+" J'aime";
      }
    }else{
      return 0+" J'aime";
    }
  }
}
