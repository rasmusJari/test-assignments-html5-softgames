import {Assets, Container, Sprite, Text, Texture, Ticker} from 'pixi.js';
import {Screen} from './screen.ts';
import {FancyButton} from "@pixi/ui";

import {AceOfShadowScreen} from "./gameScreens/aceOfShadowScreen.ts";
import {engine, MinimumEngine} from "../minimumEngine.ts";
import {PhoenixFlame} from "./gameScreens/phoenixFlame.ts";
import {MagicWordScreen} from "./gameScreens/magicWordScreen.ts";
import {createFancyButton} from "../ui/createButton.ts";
import {scaleCanvas} from "../canvasScaler.ts";

export class MainScreen extends Screen {
    private DESIGN_WIDTH = 800;
    private DESIGN_HEIGHT = 600;
    private readonly BUTTON_FLAT_TEXTURE_PATH = './ui/button_rectangle_depth_flat.png';
    private readonly BUTTON_LINE_TEXTURE_PATH = './ui/button_rectangle_depth_line.png';
    private _label!: Text;
    private _button_aos!: FancyButton;
    private _button_mwo!: FancyButton;
    private _button_pf!: FancyButton;
    private pauseButton!: FancyButton;
    private _menu!: Container;
    
    private _buttonWidth = 192;
    constructor() {
        super();
    }

    override async init(): Promise<void> {
        super.init();
        
        await Assets.load(this.BUTTON_FLAT_TEXTURE_PATH);
        await Assets.load(this.BUTTON_LINE_TEXTURE_PATH);
        
        this._menu = new Container();
        
        MinimumEngine.getInstance().app.renderer.background.color = 0x1099bb;
        this._label = new Text({
            text: 'Main Menu',
            style: {
                fontSize: 48,
                fill: 0xffffff
            }
        });
        this._label.anchor.set(0.5);
        this._menu.addChild(this._label);
        this.generateMenuButtons();
    }

    
    private generateMenuButtons() {
        const buttonAnimations = {
            hover: {
                pivot: {
                    x: 192,
                    y: 48 / 2,
                },
                props: {
                    scale: {x: 1.1, y: 1.1},
                },
                duration: 100,
            },
            pressed: {
                pivot: {
                    x: 192 / 2,
                    y: 48 / 2,
                },
                props: {
                    scale: {x: 0.9, y: 0.9},
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
        this._menu.addChild(this._button_aos);


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
        this._menu.addChild(this._button_mwo);


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
        this._menu.addChild(this._button_pf);

        this.addChild(this._menu);
    }

    
    public exit(): void {
        console.log('MainScreen exit');
        this.removeChildren();
    }
    
    
    public resize(width: number, height: number): void {
        // this showcases how to scale the canvas while maintaining aspect ratio
        scaleCanvas(width, height, this);
        
        this._menu.position.set(
            this.DESIGN_WIDTH / 2,
            this.DESIGN_HEIGHT / 2
        );
        
        this._label?.position.set(
            0,
            - this.DESIGN_HEIGHT * 0.3
        );
        
        this._button_aos.position.set(
            0,
            -this.DESIGN_HEIGHT * 0.3 + 100
        );

        this._button_mwo.position.set(
            0,
            -this.DESIGN_HEIGHT * 0.3 + 200
        );

        this._button_pf.position.set(
            0,
            -this.DESIGN_HEIGHT * 0.3 + 300
        );
    }
}
