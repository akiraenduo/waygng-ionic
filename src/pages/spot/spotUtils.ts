import * as _ from 'lodash'

export default class spotUtils {

    static incrementLike(spot, userUid){
        let likes = _.map(spot.likes,_.clone);
        if(!likes){
          likes = [];
        }
        const index = _.indexOf(likes, userUid);
        if(index < 0){
          likes.push(userUid);
        }else{
          _.pullAt(likes, index);
        }
        spot.likes = likes;
        return spot;
      }
}