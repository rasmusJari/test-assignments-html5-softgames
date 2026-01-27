import {Assets, Container, Sprite, Text, Texture, Ticker} from 'pixi.js';
import {Screen} from './screen.ts';
import {FancyButton} from "@pixi/ui";

import {AceOfShadowScreen} from "./gameScreens/aceOfShadowScreen.ts";
import {engine, MinimumEngine} from "../minimumEngine.ts";
import {PhoenixFlame} from "./gameScreens/phoenixFlame.ts";
import {MagicWordScreen} from "./gameScreens/magicWordScreen.ts";
import {createFancyButton} from "../ui/createButton.ts";

export class MainScreen extends Screen {
    private readonly BUTTON_FLAT_TEXTURE_PATH = './ui/button_rectangle_depth_flat.png';
    private readonly BUTTON_LINE_TEXTURE_PATH = './ui/button_rectangle_depth_line.png';
    private _label!: Text;
    private _button_aos!: FancyButton;
    private _button_mwo!: FancyButton;
    private _button_pf!: FancyButton;
    private pauseButton!: FancyButton;
    
    private _buttonWidth = 192;
    constructor() {
        super();
    }

    override async init(): Promise<void> {
        super.init();
        console.log('MainScreen init');
        
        await Assets.load(this.BUTTON_FLAT_TEXTURE_PATH);
        await Assets.load(this.BUTTON_LINE_TEXTURE_PATH);

        //   this.resize(window.innerWidth, window.innerHeight);
        MinimumEngine.getInstance().app.renderer.background.color = 0x1099bb;
        this._label = new Text({
            text: 'Main Menu',
            style: {
                fontSize: 48,
                fill: 0xffffff
            }
        });
        this._label.anchor.set(0.5);
        this.addChild(this._label);

        const buttonAnimations = {
            hover: {
                pivot: {
                    x: 192,
                    y: 48 / 2,
                },
                props: {
                    scale: { x: 1.1, y: 1.1 },
                },
                duration: 100,
            },
            pressed: {
                pivot: {
                    x: 192 / 2,
                    y: 48 / 2,
                },
                props: {
                    scale: { x: 0.9, y: 0.9 },
                },
                duration: 100,
            },
        };

        this._button_aos = createFancyButton(
            "Ace of Shadows",
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_LINE_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            buttonAnimations,
            () => {
                console.log('Ace of Shadows button pressed');
                engine().screenManager.changeScreen(new AceOfShadowScreen());
            }
        );
        this._button_aos.anchor.set(0.5);
        this.addChild(this._button_aos);


        this._button_mwo = createFancyButton(
            "Magic Words",
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_LINE_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            buttonAnimations,
            () => {
                console.log('Magic Words button pressed');
                engine().screenManager.changeScreen(new MagicWordScreen());
            }
        );

        this._button_mwo.anchor.set(0.5);
        this.addChild(this._button_mwo);


        this._button_pf = createFancyButton(
            "Phoenix Flame",
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_LINE_TEXTURE_PATH)!),
            new Sprite(Assets.get(this.BUTTON_FLAT_TEXTURE_PATH)!),
            buttonAnimations,
            () => {
                console.log('Phoenix Flame button pressed');
                engine().screenManager.changeScreen(new PhoenixFlame());
            }
        );
        this._button_pf.anchor.set(0.5);
        this.addChild(this._button_pf);
    }

    public override enter(): void {
        console.log('MainScreen enter');
    }

    public exit(): void {
        console.log('MainScreen exit');
        
        this.removeChildren();
    }

    public override update(ticker: Ticker): void {
        // per-frame logic
        // console.log(ticker.deltaTime);
    }
    
    public resize(width: number, height: number): void {
        this._label?.position.set(
            width * 0.5,
            height * 0.5
        );
        
        this._button_aos.position.set(
            width * 0.5,
            height * 0.6
        );
        
        this._button_mwo.position.set(
            width * 0.5,
            height * 0.7
        );

        this._button_pf.position.set(
            width * 0.5,
            height * 0.8
        );
    }
}
