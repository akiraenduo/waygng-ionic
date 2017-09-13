export class Station {
    id: string;
    nom:  string;
    latitude: number;
    longitude: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}