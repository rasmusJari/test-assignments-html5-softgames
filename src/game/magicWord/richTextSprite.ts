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

        while ((match = regex.exec(text)) !== null) {
            const emojiName = match[1];
            const startIndex = match.index;

            // Text before emoji
            displayText += text.substring(lastIndex, startIndex);
            lastIndex = regex.lastIndex;

            const texture = this._emojiMap[emojiName];
            if (!texture) {
                console.warn(`Emoji not found: ${emojiName}`);
                continue;
            }

            const fontSize = this._textObject.style.fontSize || 24;
            const emojiWidth = fontSize; // set emoji width = font size

            // Mark position for sprite
            emojiPositions.push({ emoji: emojiName, index: displayText.length, width: emojiWidth });

            // Add placeholder spaces + 2 trailing spaces
            const singleChar = new Text(this._placeholderChar, this._textObject.style);
            const spaceCount = Math.ceil(emojiWidth / singleChar.width) 
            displayText += this._placeholderChar.repeat(spaceCount);
        }

        // Add remaining text
        displayText += text.substring(lastIndex);

        // Update text object
        this._textObject.text = displayText;

        // Position emoji sprites
        emojiPositions.forEach(pos => {
            const texture = this._emojiMap[pos.emoji];
            if (!texture) return;

            const sprite = new Sprite(texture);
            sprite.anchor.set(0, 0.5);
            sprite.width = pos.width;
            sprite.height = this._textObject.style.fontSize || 24;

            // Measure width of text up to emoji position
            const substring = displayText.substring(0, pos.index);
            const measure = new Text(substring, this._textObject.style);

            sprite.x = this._textObject.x + measure.width;
            sprite.y = this._textObject.y + (this._textObject.style.fontSize || 24) / 2;

            this.addChild(sprite);
            this._emojiSprites.push(sprite);
        });
    }

    /**
     * Update text style dynamically.
     */
    public setStyle(style: Partial<TextStyle>) {
        this._style = { ...this._style, ...style };
        this._textObject.style = new TextStyle(this._style);
    }
}
