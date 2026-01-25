import { Container, Ticker, Texture } from 'pixi.js';
import {FireParticle} from "./fireParticle.ts";


export class FireEmitter extends Container {
    private _textures: Texture[];
    private _spawnRate = 0.1; // seconds
    private _timer = 0;

    constructor(textures: Texture[]) {
        super();
        this._textures = textures;

        Ticker.shared.add(this.update, this);
    }

    public update(ticker: Ticker): void {
        const dt = ticker.deltaTime / 60;
        this._timer += dt;

        if (this._timer >= this._spawnRate) {
            this._timer = 0;
            this.spawn();
        }
    }

    private spawn(): void {
        const flame = new FireParticle(this._textures);
        flame.x = (Math.random() - 0.5) * 20;
        flame.y = 0;

        this.addChild(flame);
    }
}
