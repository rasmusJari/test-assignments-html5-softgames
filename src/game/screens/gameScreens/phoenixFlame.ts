import { Screen } from '../screen.ts';
import { ParticleContainer, Texture, Ticker, Text, Assets } from 'pixi.js';
import { engine } from '../../minimumEngine.ts';
import { randomRange } from '../../../engine/utils/random.ts';
import {ParticleSystem} from "../../phoenixFlame/particleSystem.ts";


export class PhoenixFlame extends Screen {
    private _particleContainer!: ParticleContainer;
    private _particleSystem!: ParticleSystem;
    private _texture!: Texture;
    private _particleAssetPath: string = '/particles/flame_04.png';
    private _particleCountText: Text = new Text('');
    private _emitterX: number = engine().app.screen.width /2;
    private _emitterY: number = engine().app.screen.height /2;

    public async init(): Promise<void> {
        engine().app.renderer.background.color = 0x000000;
        await Assets.load(this._particleAssetPath);

        this._particleCountText = new Text({
            text: 'Particles: 0',
            style: { fontSize: 24, fill: 0xffffff }
        });
        this._particleCountText.position.set(10, 40);
        this._root?.addChild(this._particleCountText);
    }

    public enter(): void {
        this._texture = Texture.from(this._particleAssetPath);

        this._particleContainer = new ParticleContainer({
            dynamicProperties: { position: true, rotation: true, scale: true, alpha: true, uv: false }
        });
        this._root?.addChild(this._particleContainer);

        this._particleSystem = new ParticleSystem(this._particleContainer, this._texture, 10);

        // Example: set global defaults
        this._particleSystem.setDefaultConfig({
            velocityXMin: -50,
            velocityXMax: 50,
            velocityYMin: -200,
            velocityYMax: -200,
            
            startColor: 0xff4500,
            endColor: 0xffff00,
            lifetime: 1.2,
            startAlpha: 1,
            endAlpha: 0,
            startScale: 0.3,
            endScale: 0
        });

        this._particleSystem.setEmitterPosition(this._emitterX, this._emitterY);
        this._particleSystem.setEmitterRate(0.08);

        this._root!.interactive = true;
        this._root!.on('pointermove', (event) => {
            const { x, y } = event.global;
            this._particleSystem.setEmitterPosition(x, y);
        });
    }

    public exit(): void {
        this._particleSystem.clear();
    }

    public update(ticker: Ticker): void {
        const dt = ticker.deltaTime / 60;
        
        if(this._particleSystem === undefined) return;
        this._particleSystem.update(dt);
        this._particleCountText.text = `Particles: ${this._particleSystem.count()}`;
    }
    
    public resize(width: number, height: number): void {
        this._emitterX = width / 2;
        this._emitterY = height / 2;
        this._particleSystem.setEmitterPosition(this._emitterX, this._emitterY);
    }
}
