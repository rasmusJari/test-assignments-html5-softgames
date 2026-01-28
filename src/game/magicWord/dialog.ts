import {Actor, ActorAlignment} from "./actor.ts";
import {MinimumEngine} from "../minimumEngine.ts";
import {Container, Texture, Sprite, Text} from "pixi.js";
import {RichTextSprite} from "./richTextSprite.ts";
import {DialogManager} from "./dialogManager.ts";

export class Dialog extends Container {
    private _avatar: Actor;
    private _text: string;
    private _textPaddingLeft: number = 10;
    private _textPaddingTop: number = 10;
    private _textBoxX: number = 100;
    private _textBoxY: number = 400;
    private _textBoxWidth: number = 600;
    private _textBoxHeight: number = 150;
    private _rectangle: Sprite = null as any;
    private _avatarSprite: Sprite = null as any;
    private _richText: RichTextSprite = null as any;
    private _dialogManager: DialogManager;
    
    constructor(avatar: Actor, text: string, dialogManager: DialogManager) {
        super();
        this._dialogManager = dialogManager;
        this._avatar = avatar;
        this._text = text;

        MinimumEngine.getInstance().stage.addChild(this);
    }
    
    public clear(): void{
        // Remove all children from this container
        this.removeChildren();

        // Destroy children to free textures and memory
        // @ts-ignore
        this.destroy({ children: true, texture: false, baseTexture: false });
    }
    
    // draw dialog text box and avatar
    public draw(): void {
        // draw box:
        this._rectangle = new Sprite(Texture.WHITE);
        this._rectangle.tint = 0x395366;
        this._rectangle.alpha = 1;
        this._rectangle.width = this._textBoxWidth;   
        this._rectangle.height = this._textBoxHeight;
        this._rectangle.x = this._textBoxX;
        this._rectangle.y = this._textBoxY;
        this.addChild(this._rectangle);
        
        // draw avatar:
        this._avatarSprite = new Sprite(this._avatar.actorAvatar);
        if(this._avatar.alignment == ActorAlignment.LEFT){
            this._avatarSprite.x = this._textBoxX;
        } else {
            this._avatarSprite.x = this._textBoxX + this._textBoxWidth - this._avatarSprite.width;
        }

        this._avatarSprite.y = this._textBoxY + this._textBoxHeight;
        this.addChild(this._avatarSprite);


        // draw text:
        // convert to rich text:
        this._richText = new RichTextSprite(
            { fontSize: 24, fill: 0xffffff , wordWrap: true, wordWrapWidth: this._textBoxWidth },
            this._dialogManager.getEmojis(), this._textBoxWidth * 0.8
        )

        this._richText.x = this._textBoxX + this._textPaddingLeft;
        this._richText.y = this._textBoxY + this._textPaddingTop;
        this._richText.setText(this._text);
        this.addChild(this._richText);
    }

    public resize(width: number, height: number): void {
        this._textBoxX = width * 0.1;
        this._textBoxY = height - 200;
        this._textBoxWidth = width * 0.8;
        this._textBoxHeight = 150;
        
        if(this._avatar.alignment == ActorAlignment.LEFT){
            this._avatarSprite.x = this._textBoxX;
        } else {
            this._avatarSprite.x = this._textBoxX + this._textBoxWidth - this._avatarSprite.width;
        }
        this._avatarSprite.y = this._textBoxY - this._textBoxHeight + 22;
        
        this._richText.x = this._textBoxX + this._textPaddingLeft;
        this._richText.y = this._textBoxY + this._textPaddingTop;

        this._rectangle.x = this._textBoxX;
        this._rectangle.y = this._textBoxY;
        this._rectangle.width = this._textBoxWidth;
        this._rectangle.height = this._textBoxHeight;
        
        this._richText.refresh(this._textBoxWidth * 0.8);
    }
}
