import {getData} from "./dataManager.ts";
import {Actor} from "./actor.ts";

export class DialogManager {
    
    private _avatars: Set<Actor> = new Set<Actor>();
    
    constructor() {

    }

    public async setData(data: string | object) {
        let jsonData: any;

        if (typeof data === 'string') {
            // normalize quotes and parse
            const normalizedData = data
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"');
            jsonData = JSON.parse(normalizedData);
        } else {
            // already an object, no parsing needed
            jsonData = data;
        }

        console.log("Dialog data set:", jsonData);
        
        const avatarsToken = jsonData['avatars'];
        console.log(avatarsToken);
        if (avatarsToken) {
            await this.generateAvatars(avatarsToken);
        }
    }
    
    private async generateAvatars(avatarToken: any) {
        
        for (const avatar of avatarToken) {
            const name: string = avatar['name'];
            const imageUrl: string = avatar['url'];
            const alignment: string = avatar['position'];

            console.log(name);
            const actor = new Actor(name, imageUrl, alignment);
            this._avatars.add(actor);
            console.log(actor);
        }
    }

}