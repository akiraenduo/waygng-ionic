export class Station {
    id: string;
    nom:  string;
    latitude: string;
    longitude: string;
    latLong: string;

    constructor(id:string, nom:string, latitude:string, longitude:string) {
       this.id = id;
       this.nom = nom;
       this.latitude = latitude;
       this.longitude = longitude;
       if(latitude && longitude){
           this.latLong = latitude+";"+longitude;
       }
    }
}