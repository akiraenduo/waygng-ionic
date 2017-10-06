export class Hashtag {
    name:  string;
    tag: string;
    spotKeyList: string[];
    
    constructor(name:string, tag:string, spotKeyList:string[]) {
       this.name = name;
       this.tag = tag;
       this.spotKeyList = spotKeyList;
    }
}