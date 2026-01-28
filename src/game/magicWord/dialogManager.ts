import {Actor} from "./actor.ts";
import {Container, Texture, Text} from "pixi.js";
import {MinimumEngine} from "../minimumEngine.ts";
import {Dialog} from "./dialog.ts";

export class DialogManager extends Container{
    
    private _avatars: Set<Actor> = new Set<Actor>();
    private _emojis: Record<string, Texture> = {};
    private _dialogs: Set<Dialog> = new Set<Dialog>();
    private _activeDialog: Dialog | null = null;
    private _helpText: Text;

    constructor() {
        super();
        this._helpText = new Text({text: "loading dialog data...", style: {fontSize: 18, fill: 0xffffff}});
        MinimumEngine.getInstance().stage.addChild(this);
        this.addChild(this._helpText);
    }

    public initialize(): void {
        
        // Initialize dialog management
        console.log("DialogManager initialized");
        const dialogIterator = this._dialogs.values(); // returns an iterator
        
        this._helpText.text = "Click anywhere to advance dialog";
        
        // Register click event to advance dialog
        MinimumEngine.getInstance().app.view.addEventListener('click', () => {
            console.log('Canvas clicked - advance dialog');

            this.advanceDialog(dialogIterator);
        });
    }
        
    private advanceDialog(dialogIterator: Iterator<Dialog>): void {
        // Remove previous dialog if any
        if (this._activeDialog) {
            this._activeDialog.clear(); // remove all children
            MinimumEngine.getInstance().stage.removeChild(this._activeDialog);
            this._activeDialog = null;
        }

        // Get next dialog from the Set
        const next = dialogIterator.next();
        if (next.done) {
            console.log('All dialogs finished');
            return; // stop or loop if desired
        }

        const nextDialog = next.value;
        nextDialog.draw();
        MinimumEngine.getInstance().stage.addChild(nextDialog);
        this._activeDialog = nextDialog;
        
        this.resize(MinimumEngine.getInstance().width, MinimumEngine.getInstance().height);
    }

    public getEmojis(): Record<string, Texture> {
        return this._emojis;
    }
    
    public async setData(data: string | object) {
        let jsonData: any;

        if (typeof data === 'string') {
            const normalizedData = data
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"');
            jsonData = JSON.parse(normalizedData);
        } else {
            jsonData = data;
        }
        
        const avatarsToken = jsonData['avatars'];
        if (avatarsToken) {
            await this.generateAvatars(avatarsToken);
        }
        
        const emojisToken = jsonData['emojies'];
        await this.generateEmojis(emojisToken);

        const dialogsToken = jsonData['dialogue'];
        await this.generateDialogs(dialogsToken);
        
        this.initialize();
    }
    
    private async generateAvatars(avatarToken: any) {
        for (const avatar of avatarToken) {
            const name: string = avatar['name'];
            const imageUrl: string = avatar['url'];
            const alignment: string = avatar['position'];
            const actor = new Actor(name, imageUrl, alignment);
            this._avatars.add(actor);
        }
    }
    
    private async generateEmojis(emojiToken: any) {
        for (const emoji of emojiToken) {
            const id: string = emoji['name'];
            const imageUrl: string = emoji['url'];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);
            this._emojis[id] = Texture.from(bitmap);
        }
    }

    
    private async generateDialogs(dialogToken: any) {
        for (const dToken of dialogToken) {
            const actorName = dToken['name'];
            const text = dToken['text'];
            let actor = Array.from(this._avatars).find(a => a.actorName === actorName);
            
            // optional - remove undefined actors lines?
            // this depends on the designer's intent. If the system should support missing actors,
            // this check can be omitted. The system handles missing actors gracefully by logging a warning.
            if (!actor) {
                console.warn(`Actor with name ${actorName} not found for dialog.`);
                continue;
            }
            
            this._dialogs.add(new Dialog(actor, text, this));
        }
    }
    
    public resize(width: number, height: number) {
        // Handle resizing if necessary
        this._helpText.x = width * 0.2;
        this._helpText.y = 100;
        
        this._activeDialog?.resize(width, height);
    }
}
