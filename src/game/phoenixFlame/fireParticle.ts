import {AnimatedSprite, Texture, Ticker} from "pixi.js";

export class FireParticle extends AnimatedSprite {
    private _age = 0;
    private _lifetime: number;
    private _riseSpeed: number;

    constructor(textures: Texture[]) {
        super(textures);

        this.anchor.set(0.5, 1);
        this.animationSpeed = 10;
        this.loop = true;
        this.play();

        this._lifetime = 30 + Math.random() * 0.5; // seconds
        this._riseSpeed = 1;

        this.scale.set(0.6 + Math.random() * 0.4);
    }

    public update(ticker: Ticker): boolean {
        this._age += ticker.deltaTime;

        const t = this._age / this._lifetime; // 0 → 1

        this.y -= this._riseSpeed * ticker.deltaTime;
        this.alpha = 1 - t;
        this.scale.set(1 - t * 0.5);

        if (this._age >= this._lifetime) {
            this.destroy();
            return false;
        }

        return true;
    }
}
