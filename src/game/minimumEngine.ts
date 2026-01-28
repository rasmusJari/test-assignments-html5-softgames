import { Application, Container, Ticker, Text } from 'pixi.js';
import {ScreenManager} from "./screenManagement/screenManager.ts";

export class MinimumEngine {
    public static getInstance(): MinimumEngine {return this.instance;}
    private static instance: MinimumEngine;
    public readonly app: Application;
    public readonly stage: Container;
    public readonly ticker: Ticker;
    public readonly screenManager: ScreenManager;

    constructor(app: Application) {
        MinimumEngine.instance = this;
        console.log('MinimumEngine initialized');
        this.app = app;
        
        // Root container that screens draw into
        this.stage = new Container();
        this.ticker = new Ticker();
        this.ticker.start();
        this.screenManager = new ScreenManager();
        this.stage.addChild(this.screenManager['_root']);
        this.app.stage.addChild(this.stage);
        
        const fpsText = new Text({ text: 'FPS: 0', style: { fontSize: 16, fill: 0xffffff } });
        fpsText.position.set(10, 10);
        this.stage.addChild(fpsText);
        
        // fps display
        this.ticker.add((delta) => {
            fpsText.text = `FPS: ${this.ticker.FPS.toFixed(2)}`;
        });

        // clamp to 60 FPS in order to save resources especially on mobile
        this.ticker.maxFPS = 60;
    }

    public resize(): void {
        this.screenManager.resize();
    }

    public get width(): number {
        return this.app.renderer.width;
    }

    public get height(): number {
        return this.app.renderer.height;
    }
}


let instance: MinimumEngine | null = null;

/**
 * Get the main application engine
 * This is a simple way to access the engine instance from anywhere in the app
 */
export function engine(): MinimumEngine {
    return instance!;
}

export function setEngine(app: MinimumEngine) {
    console.log('MinimumEngine setEngine');
  instance = app;
}

