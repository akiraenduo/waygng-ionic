export class TempsAttente {
    idArret: string;
    idLigne:  string;
    numLignePublic: string;
    couleurFond: string;
    couleurTexte: string;
    sensAller: boolean;
    destination: string;
    precisionDestination: string;
    temps: string;
    fiable: boolean;
    numVehicule: string;
    latitude: number;
    longitude: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}