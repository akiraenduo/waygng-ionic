import { TempsAttente } from './tempsAttente';

export class StationAttente {
    public nomExact: string;
    listeTemps: TempsAttente[];
    latitude: number;
    longitude: number;


    constructor(nomExact: string, listeTemps: TempsAttente[]){
       this.nomExact = nomExact;
        this.listeTemps = listeTemps;
        
    }
    
    
}