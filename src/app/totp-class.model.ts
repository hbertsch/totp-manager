export class TotpClass {

    constructor(key: string, label: string) {
        this._label = label;
        this._key = key;
        this._code = '';
        this._validTime = 0;
    }
    

    private _code : string;
    public get code() : string {
        return this._code;
    }
    public set code(v : string) {
        this._code = v;
    }
    

    private _key: string;
    public get key(): string {
        return this._key;
    }
    public set key(v: string) {
        this._key = v;
    }


    private _label: string;
    public get label(): string {
        return this._label;
    }
    public set label(v: string) {
        this._label = v;
    }

    
    private _validTime : number;
    public get validTime() : number {
        return this._validTime;
    }
    public set validTime(v : number) {
        this._validTime = v;
    }
    

}
