export class Hashtag {
    name:  string;
    spotKeyList: string[];
    
    constructor(name:string, spotKeyList:string[]) {
       this.name = name;
       this.spotKeyList = spotKeyList;
    }
}