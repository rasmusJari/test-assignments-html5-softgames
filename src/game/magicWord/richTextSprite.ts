import { Container, Text, Sprite, Texture, TextStyle } from 'pixi.js';

/**
 * Rich text renderer with inline emoji sprites.
 * Replaces {emojiName} tokens with Sprites and shifts text.
 */
export class RichTextSprite extends Container {
    private _textObject: Text;
    private _emojiSprites: Sprite[] = [];
    private _emojiMap: Record<string, Texture>;
    private _style: Partial<TextStyle>;
    private _placeholderChar: string = ' '; // character to reserve space for emoji

    constructor(
        emojiMap: Record<string, Texture>,
        style?: Partial<TextStyle>,
        placeholderChar: string = ' ' // can customize replacement char
    ) {
        super();

        this._emojiMap = emojiMap;
        this._style = style || {};
        this._placeholderChar = placeholderChar;

        const textStyle = new TextStyle({
            fontSize: 24,
            fill: 0xffffff,
            wordWrap: true,
            wordWrapWidth: 400,
            ...this._style
        }); 
            
        this._textObject = new Text({ text: '', style: textStyle });

        this.addChild(this._textObject);
    }

    public getText() : Text{
        return this._textObject;
    }        
    

    /**
     * Set rich text content with {emoji} tokens.
     * Each emoji reserves space and two trailing placeholders.
     */
    public setText(text: string) {
        // Remove previous emoji sprites
        this._emojiSprites.forEach(e => e.destroy());
        this._emojiSprites = [];

        const regex = /\{([^}]+)\}/g;
        let match: RegExpExecArray | null;
        let lastIndex = 0;
        let displayText = '';
        const emojiPositions: { emoji: string; index: number; width: number }[] = [];

        const fontSize = this._textObject.style.fontSize || 24;

        while ((match = regex.exec(text)) !== null) {
            const emojiName = match[1];
            const startIndex = match.index;

            // Add text before emoji
            displayText += text.substring(lastIndex, startIndex);
            lastIndex = regex.lastIndex;

            const texture = this._emojiMap[emojiName];
            if (!texture) {
                console.warn(`Emoji not found: ${emojiName}`);
                continue;
            }

            const emojiWidth = fontSize; // safe approximation

            // Mark position for sprite
            emojiPositions.push({ emoji: emojiName, index: displayText.length, width: emojiWidth });

            // Add placeholder characters (2 trailing spaces)
            const spaceCount = Math.max(Math.ceil(emojiWidth / fontSize), 1) + 2; // always at least 1
            displayText += this._placeholderChar.repeat(spaceCount);
        }

        // Add remaining text
        displayText += text.substring(lastIndex);

        // Update the text object
        this._textObject.text = displayText;

        // Position emoji sprites
        emojiPositions.forEach(pos => {
            const texture = this._emojiMap[pos.emoji];
            if (!texture) return;

            const sprite = new Sprite(texture);
            sprite.anchor.set(0, 0.5);
            sprite.width = pos.width;
            sprite.height = fontSize;

            // Use temporary Text to measure width up to emoji
            const metrics = new Text(displayText.substring(0, pos.index), { ...this._textObject.style, wordWrap: false });
            sprite.x = this._textObject.x + metrics.width;
            sprite.y = this._textObject.y + fontSize / 2;
            metrics.destroy();

            this.addChild(sprite);
            this._emojiSprites.push(sprite);
        });
    }

    // private updateEmojiPositions() {
    //     const fontSize = this._textObject.style.fontSize || 24;
    //
    //     this._emojiSprites.forEach(info => {
    //         // Measure width of text up to the emoji index
    //         const substring = this._textObject.text.substring(0, info.index);
    //         const tempText = new Text(substring, { ...this._textObject.style, wordWrap: false });
    //         info.sprite.x = this._textObject.x + tempText.width;
    //         info.sprite.y = this._textObject.y + fontSize / 2;
    //         tempText.destroy();
    //     });
    // }

    /**
     * Update text style dynamically.
     */
    public setStyle(style: Partial<TextStyle>) {
        this._style = { ...this._style, ...style };
        this._textObject.style = new TextStyle(this._style);
    }
    
    public resize(width: number, height: number): void {
        // Handle resizing if necessary
        this._textObject.style.wordWrapWidth = width * 0.6;
    }
    
    
}

interface EmojiInfo {
    emoji: string;
    index: number; // character index in the text
    sprite: Sprite;
}