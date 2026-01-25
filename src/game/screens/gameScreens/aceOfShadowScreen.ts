import {Screen} from "../screen.ts";
import {AceOfShadow} from "../../aceOfShadow/aceOfShadow.ts";
import {engine} from "../../../app/getEngine.ts";

export class AceOfShadowScreen extends Screen{
    private _aceOfShadow!: AceOfShadow;
    
    
    constructor() {
        super();
    }

    override async init(): Promise<void> {
        console.log("AceOfShadowScreen initialized");
        
        this._aceOfShadow = new AceOfShadow();
        await this._aceOfShadow.init();
    }
    
    override async enter(): Promise<void> {
        console.log("AceOfShadowScreen started");
        this._aceOfShadow.start();
    }

    resize(width: number, height: number) {
        
        this._aceOfShadow.resize(width, height);
    }
}