import { Container, Graphics, Text } from 'pixi.js';

export class ReloadButton extends Container {
    constructor(onClick: () => void) {
        super();

        const bg = new Graphics()
            .roundRect(0, 0, 120, 40, 8)
            .fill(0x333333);

        const label = new Text({
            text: 'Reload',
            style: {
                fill: 0xffffff,
                fontSize: 16
            }
        });

        label.anchor.set(0.5);
        label.position.set(60, 20);

        this.addChild(bg, label);

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointerdown', onClick);
    }
}
