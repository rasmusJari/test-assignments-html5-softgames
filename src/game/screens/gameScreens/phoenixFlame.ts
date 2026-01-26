import { Screen } from '../screen.ts';
import {ParticleContainer, Texture, Ticker, Text, Assets, Sprite} from 'pixi.js';
import { engine } from '../../minimumEngine.ts';
import { randomRange } from '../../../engine/utils/random.ts';
import {ParticleSystem} from "../../phoenixFlame/particleSystem.ts";
import {sound} from "@pixi/sound";
import {Asset} from "@assetpack/core";


export class PhoenixFlame extends Screen {
    private _particleContainer!: ParticleContainer;
    private _particleSystem!: ParticleSystem;
    private _texture!: Texture;
    private _particleAssetPath: string = '/particles/flame_04.png';
    private _particleCountText: Text = null as any;
    private _emitterX: number = engine().app.screen.width /2;
    private _emitterY: number = engine().app.screen.height /2;
    private _torchSprite: Sprite = null as any;

    public async init(): Promise<void> {
        engine().app.renderer.background.color = 0x000000;
        await Assets.load(this._particleAssetPath);
        await Assets.load('/art/torch.png')

        this._particleCountText = new Text({
            text: 'Particles: 0',
            style: { fontSize: 24, fill: 0xffffff }
        });
        this._particleCountText.position.set(10, 40);
        this._root?.addChild(this._particleCountText);
    }

    public enter(): void {
        sound.add('music', '/sfx/taleOfFire.mp3');
        sound.play('music', { loop: true, volume: 0.1 });
        this._torchSprite = new Sprite(Assets.get('/art/torch.png'));
        this._torchSprite.anchor.set(0.5, 0);
        this._torchSprite.position.set(this._emitterX, this._emitterY + 50);
        this._root?.addChild(this._torchSprite);
        
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
            lifetime: 1.5,
            startAlpha: 1,
            endAlpha: 0,
            startScale: 0.3,
            endScale: 0
        });

        this._particleSystem.setEmitterPosition(this._emitterX, this._emitterY);
        this._particleSystem.setEmitterRate(0.08);
    }

    public exit(): void {
        this._particleSystem.clear();
        sound.stop('music');
        sound.remove('music');
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
        this._torchSprite.x = width / 2;
        this._torchSprite.y = height / 2;
        if(this._particleSystem === undefined) return;
        this._particleSystem.setEmitterPosition(this._emitterX, this._emitterY);
    }
}
