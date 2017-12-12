import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { QueryConfig } from '../../models/queryConfig';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class PaginationService {
  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
  private query: QueryConfig;
  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable(); 
  subscription: Subscription;
  constructor(private afs: AngularFirestore) { }
  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any, refresher?:any) { 
    this._data = new BehaviorSubject([]);
    this._done.next(false);
    this._loading.next(false);    
    this.query = { 
      path,
      field,
      limit: 20,
      userUid: "",
      reverse: false,
      prepend: false,
      ...opts
    }
    const first = this.afs.collection(this.query.path, ref => {
      if(this.query.userUid.length > 0){
        return ref.where('userUid', '==', this.query.userUid)
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
      }else{
        return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
      }

              
    })
    this.mapAndUpdate(first,{refresher:refresher})
    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
        .scan( (acc, val) => { 
          return this.query.prepend ? val.concat(acc) : acc.concat(val)
        })
  }
 
  // Retrieves additional data from firestore
  more(infiniteScroll) {
    const cursor = this.getCursor()
    const more = this.afs.collection(this.query.path, ref => {
      if(this.query.userUid.length > 0){
        return ref.where('userUid', '==', this.query.userUid)
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
      }else{
        return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
      }

    })
    this.mapAndUpdate(more,{infiniteScroll:infiniteScroll})
  }
  // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc 
    }
    return null
  }
  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>,loader?:any) {
    if (this._done.value || this._loading.value) { 
        this.handleLoader(loader);
        return 
    
    };
    // loading
    this._loading.next(true)
    // Map snapshot with doc ref (needed for cursor) 
    
    this.subscription = col.snapshotChanges(['added'])
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })
  
        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values
        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)
        this.handleLoader(loader);
        // no more values, mark done
        if (!values.length) {
          this._done.next(true)
        }
    })
    .subscribe(() => {
        this.subscription.unsubscribe();
    });

    return this.subscription;
  }

  handleLoader(loader:any){
    if(loader){
      if(loader.infiniteScroll){
        loader.infiniteScroll.complete();            
    }
      if(loader.refresher){
        loader.refresher.complete();         
      }
    }
  }

}