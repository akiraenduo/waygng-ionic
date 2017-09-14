import { Injectable } from '@angular/core';
import { Http, Response,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Station } from '../../object/station';
import { StationAttente } from '../../object/stationAttente';
import { TempsAttente } from '../../object/tempsAttente';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GinkoProvider {
    
  
  private urlGinko = 'https://www.ginkoopenapi.fr';


  constructor(public http: Http) {
    console.log('Hello RestProvider Provider');
  }




    getStations(): Observable<Station[]> {
        return this.http
            .get(this.urlGinko+"/DR/getArrets.do")
            .map(response => {
                return response.json().objets
                    .map(station => {
                    return new Station(station);
                });
            })
            .catch(this.handleError);
    }

    getTempsLieu(nameStation): Observable<StationAttente> {
        let params = new URLSearchParams();
        params.set('nom', nameStation);
        params.set('nb', '2');
        return this.http
            .get(this.urlGinko+"/TR/getTempsLieu.do", { search: params })
            .map(response => {
                var data = response.json().objets;
                return new StationAttente(data.nomExact, data.listeTemps);
            })
            .catch(this.handleError);
    }
    

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
