import {Screen} from "../screen.ts";
import {getData} from "../../magicWord/dataManager.ts";
import {DialogManager} from "../../magicWord/dialogManager.ts";

export class MagicWordScreen extends Screen{

    private _dialogManager: DialogManager = new DialogManager();

    constructor() {
        super();
        getData('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords').then(data => {
            console.log('MagicWord data loaded:', data);
            this._dialogManager.setData(data);
        })
    }
    
    

}