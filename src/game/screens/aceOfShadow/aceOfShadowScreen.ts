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
        
        engine().renderer.background.color = 0x000000;
        
        this._aceOfShadow = new AceOfShadow();
        this._aceOfShadow.init();
    }
    
    override async enter(): Promise<void> {
        console.log("AceOfShadowScreen started");
        this._aceOfShadow.start();
    }

}