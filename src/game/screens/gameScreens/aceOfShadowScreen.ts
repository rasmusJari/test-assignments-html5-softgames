import {Screen} from "../screen.ts";
import {AceOfShadow} from "../../aceOfShadow/aceOfShadow.ts";

class MainMenuScreen extends Screen {
}

export class AceOfShadowScreen extends Screen{
    private _aceOfShadow!: AceOfShadow;
    
    
    constructor() {
        super();
    }

    override async init(): Promise<void> {
        console.log("AceOfShadowScreen initialized");
        
        this._aceOfShadow = new AceOfShadow();
        await this._aceOfShadow.init(this);
    }
    
    override async enter(): Promise<void> {
        console.log("AceOfShadowScreen started");
        this._aceOfShadow.start();
    }

    exit() {
        this._aceOfShadow.exit();
    }

    resize(width: number, height: number) {
        
        this._aceOfShadow.resize(width, height);
    }
}