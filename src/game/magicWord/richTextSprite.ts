import { Container, Sprite, Texture, Text, TextStyle } from 'pixi.js';

interface EmojiMap {
    [name: string]: Texture;
}

interface Line {
    textObj: Text;
    emojis: Sprite[];
}

export class RichTextSprite extends Container {
    private _lines: Line[] = [];
    private _emojiMap: EmojiMap;
    private _placeholderChar: string = ' '; // base placeholder for emoji
    private _extraSpaceAfterEmoji: number = 6; // extra spaces after emoji
    private _style: Partial<TextStyle>;
    private _rawText: string = '';
    private _wordWrapWidth: number;

    constructor(style: Partial<TextStyle>, emojiMap: EmojiMap, wordWrapWidth: number, extraSpaceAfterEmoji = 2.5) {
        super();
        this._style = style;
        this._emojiMap = emojiMap;
        this._wordWrapWidth = wordWrapWidth;
        this._extraSpaceAfterEmoji = extraSpaceAfterEmoji;
    }

    public setText(text: string) {
        this._rawText = text;
        this.clearLines();
        this.buildLines();
    }

    public refresh(wordWrapWidth?: number) {
        if (wordWrapWidth !== undefined) this._wordWrapWidth = wordWrapWidth;
        const currentText = this._rawText;
        this.clearLines();
        this._rawText = currentText;
        this.buildLines();
    }

    private clearLines() {
        this._lines.forEach(line => {
            line.textObj.destroy();
            line.emojis.forEach(e => e.destroy());
        });
        this._lines = [];
    }

    private buildLines() {
        const fontSize = this._style.fontSize || 24;
        const lineHeight = this._style.lineHeight || fontSize;

        // Replace emoji tags with placeholders + extra spaces
        const textWithPlaceholders = this._rawText.replace(/\{([^}]+)\}/g, () =>
            this._placeholderChar + this._placeholderChar.repeat(this._extraSpaceAfterEmoji)
        );

        // Manual word wrap
        const words = textWithPlaceholders.split(/(\s+)/); // keep spaces
        const linesText: string[] = [];
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine + word;
            const measure = new Text(testLine, { ...this._style, wordWrap: false });
            if (measure.width > this._wordWrapWidth && currentLine.length > 0) {
                linesText.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
            measure.destroy();
        }
        if (currentLine.length) linesText.push(currentLine);

        // Build Text objects + emoji sprites per line
        let charIndex = 0;
        linesText.forEach((lineText, lineNumber) => {
            const textObj = new Text(lineText, this._style);
            textObj.x = 0;
            textObj.y = lineNumber * lineHeight;
            this.addChild(textObj);

            const emojis: Sprite[] = [];

            // Find emoji tags in raw text that belong to this line
            const regex = /\{([^}]+)\}/g;
            let match: RegExpExecArray | null;
            while ((match = regex.exec(this._rawText)) !== null) {
                const emojiName = match[1];
                const emojiPos = match.index;

                if (emojiPos >= charIndex && emojiPos < charIndex + lineText.length) {
                    const linePos = emojiPos - charIndex;

                    // measure width up to placeholder
                    const substring = lineText.substring(0, linePos);
                    const measure = new Text(substring, { ...this._style, wordWrap: false });
                    const xOffset = measure.width;
                    measure.destroy();

                    const texture = this._emojiMap[emojiName];
                    if (!texture) continue;

                    const sprite = new Sprite(texture);
                    sprite.anchor.set(0, 0.5);
                    sprite.width = fontSize;
                    sprite.height = fontSize;
                    sprite.x = textObj.x + xOffset;
                    sprite.y = textObj.y + fontSize / 2;

                    this.addChild(sprite);
                    emojis.push(sprite);
                }
            }

            this._lines.push({ textObj, emojis });
            charIndex += lineText.length;
        });
    }
}
