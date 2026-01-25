import {Screen} from "../screen.ts";
import {DialogManager} from "../../magicWord/dialogManager.ts";
import {getData} from "../../magicWord/loadExternalData.ts";

export class MagicWordScreen extends Screen{

    private _dialogManager: DialogManager = new DialogManager();

    constructor() {
        super();
        getData('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords').then(data => {
            this._dialogManager.setData(data);
        })
    }
    
    public enter() {
        super.enter();
        console.log("Entered MagicWordScreen");
    }

    resize(width: number, height: number) {
        super.resize(width, height);
        this._dialogManager.resize(width, height);
    }

}