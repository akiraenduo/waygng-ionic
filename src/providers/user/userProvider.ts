import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { HashtagHisto } from '../../models/hashtagHisto';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  authState: any = null;

  constructor(public http: Http,
              public platform: Platform,
              private afs: AngularFirestore) {
  }
  

  fetchUser(uid:string):AngularFirestoreDocument<any>{
    return this.afs.doc('/users/'+uid);
  }

  fetchUsers():AngularFirestoreCollection<any>{
    return this.afs.collection('/users/')
  }


  removeHistoryHashtag(userUid:string, hashtagKey:string){
    const item = this.afs.doc('/users/'+userUid+'/hashtagsHisto/'+hashtagKey);
    item.delete();
  }

  addHistoryHashtag(userUid:string, hashtagId:string, hashtagHisto:HashtagHisto){
    hashtagHisto.dateUpdate = new Date().getTime();
    const item = this.afs.doc('/users/'+userUid+'/hashtagsHisto/'+hashtagId);
    item.set(hashtagHisto);
  }

  getHistoryHashtags(userUid:string):AngularFirestoreCollection<any>{
    return this.afs.collection('/users/'+userUid+'/hashtagsHisto', ref => ref.orderBy('dateUpdate','desc'));
  }

  getNotifications(userUid:string,withNotificationReaded:boolean):AngularFirestoreCollection<any>{
    if(withNotificationReaded){
      return this.afs.collection('/users/'+userUid+'/notifications', ref => ref.orderBy('dateUpdate','desc'));
    }else{
      return this.afs.collection('/users/'+userUid+'/notifications', ref => ref.where("read","==",false));
    }
    
  }

  removeNotification(userUid:string, notifId:string){
    this.afs.doc('/users/'+userUid+'/notifications/'+notifId).delete();
  }

  updateReadNotification(userUid:string, notifId:string){
    this.afs.doc('/users/'+userUid+'/notifications/'+notifId).update({read:true});
  }

  resetNotification(userUid:string){
    this.afs.doc('/users/'+userUid).update({notificationNotSaw:0}); 
  }

}
