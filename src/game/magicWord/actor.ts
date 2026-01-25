import {Assets, Sprite, Texture} from "pixi.js";
import PIXI from "pixi.js";
import {MinimumEngine} from "../minimumEngine.ts";

export class Actor{
    private readonly _actorName: string;
    private readonly _avatarUrl: string;
    private readonly _alignment: string = "neutral";
    private _avatarSprite!: Sprite;

    constructor(name: string, avatarUrl: string, alignment: string) {
        this._actorName = name;
        this._avatarUrl = avatarUrl;
        this._alignment = alignment;
        
        this.loadAvatar();
    }
    
    get actorName(): string {
        return this._actorName;
    }
    
    get actorAvatar(): Sprite {
        return this._avatarSprite;
    }
    
    get alignment(): string {
        return this._alignment;
    }

    private async loadAvatar(): Promise<void> {
        // 1. Fetch image
        const response = await fetch(this._avatarUrl);
        const blob = await response.blob();

        // 2. Convert to ImageBitmap (bypasses Assets entirely)
        const bitmap = await createImageBitmap(blob);

        // 3. Create texture directly from bitmap
        const texture = Texture.from(bitmap);

        const sprite = new Sprite(texture);
        sprite.x = this._alignment === 'left' ? 50 : 600;
        sprite.y = 500;
        sprite.width = 128;
        sprite.height = 128;

        MinimumEngine.getInstance().stage.addChild(sprite);
    }
}