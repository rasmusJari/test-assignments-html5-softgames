import {engine} from "../minimumEngine.ts";
import {Assets, Sprite, Ticker} from "pixi.js";
import {Tween} from "../tween.ts";
import {Sound} from "@pixi/sound";
import {Easing} from "../easing.ts";

export class AceOfShadow{
    
    private _stackA: Set<Sprite>;
    private _stackB: Set<Sprite>;
    private _spriteCard!: Sprite;
    private _timer: number = 0;
    private _cardTransferInterval: number = 1000; // milliseconds
    private readonly _numberOfCards: number = 144;
    
    private _width: number = engine().width;
    private _height: number = engine().height;
    private _sfxCardSlide!: Sound;
    private _sfxCardPlace!: Sound;
    
    constructor(){
        this._stackA = new Set<Sprite>();
        this._stackB = new Set<Sprite>();
    }
    
    public async init(): Promise<void> {
        
        engine().ticker.add( (ticker) => {
            this.update(ticker);
        });

        await Assets.load('/ui/cardBack_green4.png');
        this._sfxCardSlide = Sound.from('/sfx/cardSlide7.wav');
        this._sfxCardSlide.volume = 0.3;
        
        this._sfxCardPlace = Sound.from('/sfx/cardSlide8.wav');
        this._sfxCardPlace.volume = 0.3;
    }
    
    public start(): void {
        // console.log("AceOfShadow started");

        const x = this._width / 2 + 125 + this.iteration * 0.2;
        let y = this._height / 2 - this.iteration * 1;
        for(let i = 0; i < this._numberOfCards; i++){
            const sprite = new Sprite(Assets.get('/ui/cardBack_green4.png'));
            sprite.x = x;
            sprite.y = y;
            sprite.zIndex = -sprite.y; // for proper layering
            engine().stage.addChild(sprite);
            this._stackA.add(sprite);
        }

        // reverse stack A for proper layering
      this._stackA = new Set(Array.from(this._stackA).reverse());

    }
    
    private update(ticker: Ticker){
        const dt = 1000 / 60; // assuming 60 FPS
        this._timer += dt;
        if(this._timer >= this._cardTransferInterval){
            this.transferCard();
            this._timer = 0;
        }
    }
    
    private iteration: number = 0;
    private async transferCard(){
        if(this._stackA.size === 0) return;
        
        const card = this._stackA.values().next().value;
        
        if(!card) return;
        
        this._stackA.delete(card);
        this._stackB.add(card);
        
        // play slide sound
        this._sfxCardSlide.speed = 0.8 + Math.random() * 0.2;
        this._sfxCardSlide.play();

        // tween to new position
        const x = this._width / 2 + 125 + this.iteration * 0.2;
        let y   = this._height / 2 - this.iteration;
        const tween = new Tween(
            card.position,
            { x: x, y: y },
            2, // duration in seconds
            (t) => t * t,
            () => {
                card.x = this._width / 2 + 125 + this.iteration * 0.2;
                card.y = this._height / 2 - this.iteration;
                card.zIndex = -card.y * 10; // adjust zIndex after move
                
                // play place sound
                this._sfxCardPlace.speed = 0.8 + Math.random() * 0.2;
                this._sfxCardPlace.play();
            }
        );

        // sale effect
        const scaleUp = new Tween(
            card.scale,
            { x: 1.1, y: 1.1 },
            1.0,
            (t) => Easing.easeInOutCubic(t),
            () => {
                // scale back down
                new Tween(
                    card.scale,
                    { x: 1.0, y: 1.0 },
                    1.3,
                    (t) => Easing.easeInOutCubic(t)
                ).start();
            }
        );
        
        tween.start();
        scaleUp.start();
        
        this.iteration++;
    }
    
    public resize(width: number, height: number): void {
        // Handle resize if necessary
        this._width = width;
        this._height = height;
        
        // adjust position of set A
        const xA = width / 2 - 125;
        let yA = height / 2 ;
        let indexA = 0;
        for(const card of this._stackA){
            card.x = xA + indexA * 0.2;
            card.y = yA - indexA;
            indexA++;
        }
        
        // adjust position of set B
        const xB = width / 2 + 125;
        let yB = height / 2 ;
        let indexB = 0;
        for(const card of this._stackB){
            card.x = xB + indexB * 0.2;
            card.y = yB - indexB * 1;
            indexB++;
        }
    }
}