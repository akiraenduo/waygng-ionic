export class Station {
    id: string;
    name:  string;
    latitude: string;
    longitude: string;
    latLong: string;

    constructor(id:string, name:string, latitude:string, longitude:string) {
       this.id = id;
       this.name = name;
       this.latitude = latitude;
       this.longitude = longitude;
       if(latitude && longitude){
           this.latLong = latitude+";"+longitude;
       }
    }
}