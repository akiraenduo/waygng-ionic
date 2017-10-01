import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatHashtagPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatHashtag',
})
export class FormatHashtagPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    let message = value;
    let rx = /\b(?:(?:https?|ftps?):\/\/|www\.)\S+|#(\w+)\b/gi;
    let m;
    while ((m = rx.exec(value)) !== null) {
      if (m[1]){
        message = message.replace("#"+m[1],"<span class='hashtag'>#"+m[1]+"</span>");
      }
   }

    return message;
  }
}
