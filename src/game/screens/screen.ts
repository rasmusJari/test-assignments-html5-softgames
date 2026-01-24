import {Container, Ticker} from 'pixi.js';
import {MinimumEngine} from "../minimumEngine.ts";

export abstract class Screen extends Container {
    private _initialized = false;
    protected _root: Container | null = null;

    constructor() {
        super();
        this._root = new Container();
        MinimumEngine.getInstance().stage.addChild(this._root);
    }
    
    /** Called once */
    public async init(): Promise<void> {}

    /** Called every time screen becomes active */
    public enter(): void {}

    /** Called every time screen is removed */
    public exit(): void {
        
    }

        /** Called every frame while active */
    public update(ticker: Ticker): void {
        // console.log(ticker.deltaTime);
    }

    /** navigationPlugin hook */
    public async onEnter(): Promise<void> {
        if (!this._initialized) {
            this._initialized = true;
            await this.init();
        }

        this.enter();
    }

    /** navigationPlugin hook */
    public onExit(): void {
        this.exit();
    }
    
    public resize(width: number, height: number): void {}
}
