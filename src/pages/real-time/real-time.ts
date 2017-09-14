import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

import { TempsAttente } from '../../object/tempsattente';
import { StationAttente } from '../../object/stationAttente';

/**
 * Generated class for the RealTimePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-real-time',
  templateUrl: 'real-time.html',
})
export class RealTimePage {
  
  station: any;
  listeTemps: TempsAttente[] = [];
  stationAttente: StationAttente;
  nomExact: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.station = navParams.get("station");
  }

  ionViewDidLoad() {
    this.rest.getTempsLieu2(this.station.nom)
        .subscribe((stationAttente) => {
          this.stationAttente = stationAttente;
          this.nomExact = this.stationAttente.nomExact;
          this.listeTemps = this.stationAttente.listeTemps;
          console.log(this.stationAttente);
        }
    );
  }

}
