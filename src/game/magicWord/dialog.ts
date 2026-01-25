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

        // Optional: destroy children to free textures and memory
        // @ts-ignore
        this.destroy({ children: true, texture: false, baseTexture: false });
    }
    
    // draw dialog text box and avatar
    public draw(): void {
        // Placeholder for drawing logic
        // console.log(`Drawing dialog for ${this._avatar.actorName}: ${this._text}`);
        
        // box:
        this._rectangle = new Sprite(Texture.WHITE);
        this._rectangle.tint = 0xFF0000;
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
        
        const text = new Text({text: this._richText});

        console.log(text);
        this.addChild(text);
        
        // this._richText = new RichTextSprite(this._dialogManager.getEmojis(), { fontSize: 24, fill: 0xffffff });
        this._richText = new RichTextSprite(
            { fontSize: 24, fill: 0xffffff , wordWrap: true, wordWrapWidth: this._textBoxWidth },
            this._dialogManager.getEmojis(), this._textBoxWidth * 0.8
        )
        // this._richText = new RichTextSprite(
        //     { fontSize: 24, fill: 0xffffff , wordWrap: true, wordWrapWidth: this._textBoxWidth },
        //     { emojiMap: this._dialogManager.getEmojis(), placeholderChar: '_' }
        // );
        this._richText.x = this._textBoxX + this._textPaddingLeft;
        this._richText.y = this._textBoxY + this._textPaddingTop;
        this._richText.setText(this._text);
        this.addChild(this._richText);
        // // draw multi line text:
        // // Break text into multiple lines
        // const lines = this.wrapText(this._richText.getText().text, this._textBoxWidth, this._richText);
        // const lineHeight = this._richText.height || 32;
        //
        // // Draw each line using RichTextSprite
        // let yOffset = 0;
        // lines.forEach(line => {
        //     this._richText.setText(line);
        //     this._richText.x = this._textBoxX + 10; // padding
        //     this._richText.y = this._textBoxY + 10 + yOffset;
        //     MinimumEngine.getInstance().stage.addChild(this._richText);
        //
        //     yOffset += lineHeight * 1.2; // line spacing
        // });
    }

    // private wrapText(text: string, maxWidth: number, richText: RichTextSprite): string[] {
    //     const words = text.split(' ');
    //     const lines: string[] = [];
    //     let currentLine = '';
    //
    //     words.forEach(word => {
    //         const testLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
    //        
    //         const metrics = new Text(testLine.replace(/\{[^}]+\}/g, ''), richText['_textObject'].style);
    //         if (metrics.width > maxWidth && currentLine.length > 0) {
    //             lines.push(currentLine);
    //             currentLine = word;
    //         } else {
    //             currentLine = testLine;
    //         }
    //     });
    //
    //     if (currentLine.length > 0) {
    //         lines.push(currentLine);
    //     }
    //
    //     return lines;
    // }
    
    public resize(width: number, height: number): void {
        if(this._avatar.alignment == ActorAlignment.LEFT){
            this._avatarSprite.x = this._textBoxX - this._avatarSprite.width * 0.5;
        } else {
            this._avatarSprite.x = this._textBoxX + this._textBoxWidth - this._avatarSprite.width;
        }
        this._avatarSprite.y = this._textBoxY + this._textBoxHeight - 20;
        this._textBoxX = width * 0.1;
        this._textBoxY = height - 200;
        this._textBoxWidth = width * 0.8;
        this._textBoxHeight = 150;
        this._richText.x = this._textBoxX + this._textPaddingLeft;
        this._richText.y = this._textBoxY + this._textPaddingTop;

        this._rectangle.x = this._textBoxX;
        this._rectangle.y = this._textBoxY;
        this._rectangle.width = this._textBoxWidth;
        this._rectangle.height = this._textBoxHeight;
        
        // this._richText.resize(width, height);
        this._richText.refresh(this._textBoxWidth * 0.8);
    }
}
