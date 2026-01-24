import {engine} from "../minimumEngine.ts";
import {Assets, Sprite, Ticker} from "pixi.js";
import {Tween} from "../tween.ts";
import {Sound} from "@pixi/sound";

export class AceOfShadow{
    
    private _stackA: Set<Sprite>;
    private _stackB: Set<Sprite>;
    private _spriteCard!: Sprite;
    private _timer: number = 0;
    private _cardTransferInterval: number = 400; // milliseconds
    
    private _width: number = engine().width;
    private _height: number = engine().height;
    private _sfxCardSlide!: Sound;
    
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
    }
    
    public start(): void {
        // console.log("AceOfShadow started");

        const x = this._width / 2 + 100 + this.iteration * 0.2;
        let y = this._height / 2 - this.iteration * 1;
        for(let i = 0; i < 50; i++){
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
        this._timer += ticker.deltaMS;
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

        // tween to new position
        const x = this._width / 2 + 100 + this.iteration * 0.2;
        let y   = this._height / 2 - this.iteration;

        this._sfxCardSlide.speed = 0.8 + Math.random() * 0.2;
        this._sfxCardSlide.play();

        const tween = new Tween(
            card.position,
            { x: x, y: y },
            0.3, // duration in seconds
            (t) => t * t, // optional quadratic easing
            () => {
                card.x = this._width / 2 + 100 + this.iteration * 0.2;
                card.y = this._height / 2 - this.iteration;
                card.zIndex = -card.y * 10; // adjust zIndex after move
            }
        );

        tween.start();
        

        // Animate card transfer (simple example)
        //card.zIndex -= 10;

        
        this.iteration++;
    }
    
    public resize(width: number, height: number): void {
        // Handle resize if necessary
        this._width = width;
        this._height = height;
        
        // adjust position of set A
        const xA = width / 2 - 100;
        let yA = height / 2 ;
        let indexA = 0;
        for(const card of this._stackA){
            card.x = xA + indexA * 0.2;
            card.y = yA - indexA * 1;
            indexA++;
        }
        
        // adjust position of set B
        const xB = width / 2 + 100;
        let yB = height / 2 ;
        let indexB = 0;
        for(const card of this._stackB){
            card.x = xB + indexB * 0.2;
            card.y = yB - indexB * 1;
            indexB++;
        }
    }
}