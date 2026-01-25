import { Screen } from '../screen.ts';
import { ParticleContainer, Texture, Ticker, Text, Assets } from 'pixi.js';
import { engine } from '../../minimumEngine.ts';
import {ParticleSystem} from "../../phoenixFlame/particleSystem.ts";
import {randomRange} from "../../../engine/utils/random.ts";


export class PhoenixFlame extends Screen {
    private _particleContainer!: ParticleContainer;
    private _particleSystem!: ParticleSystem;
    private _texture!: Texture;
    private _particleAssetPath: string = '/particles/smoke_04.png';
    private _particleCountText!: Text;
    private _fireEmitterX: number = engine().app.screen.width * 0.5;
    private _fireEmitterY: number = engine().app.screen.height * 0.5;

    public async init(): Promise<void> {
        engine().app.renderer.background.color = 0x000000;
        await Assets.load(this._particleAssetPath);

        const style = {
            fontSize: 24,
            fill: 0xffffff
        }
        this._particleCountText = new Text(
            {text: "", style}
        )
        this._particleCountText.position.set(10, 40);
        this._root?.addChild(this._particleCountText);
    }

    public enter(): void {
        console.log('PhoenixFlame enter');
        this._texture = Texture.from(this._particleAssetPath);

        // Create container
        this._particleContainer = new ParticleContainer({
            dynamicProperties: {
                position: true,
                rotation: true,
                scale: true,
                alpha: true,
                uv: false
            }
        });
        this._root?.addChild(this._particleContainer);

        // Create particle system
        this._particleSystem = new ParticleSystem(
            this._particleContainer, 
            this._texture,
            10
        );
        
        this._particleSystem.setEmitterPosition(this._fireEmitterX, this._fireEmitterY);
        this._particleSystem.setEmitterRate(0.1); // spawn new particle every 0.03s

    }

    public exit(): void {
        this._particleSystem.clear();
    }

    public update(ticker: Ticker): void {
        const dt = ticker.deltaTime / 60; // convert to seconds
        if(!this._particleSystem) return;
        this._particleSystem.update(dt);
        this._particleCountText.text = `Particles: ${this._particleSystem.count()}`;
    }

    public resize(width: number, height: number): void {    
        // Handle resizing if necessary
        this._fireEmitterX = width * 0.5;
        this._fireEmitterY = height * 0.5;
        this._particleSystem.setEmitterPosition(this._fireEmitterX, this._fireEmitterY);
    }
}
