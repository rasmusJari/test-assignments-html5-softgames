import { Container, Ticker } from 'pixi.js';
import { Screen } from '../screens/screen';
import { MinimumEngine } from '../minimumEngine';

export class ScreenManager {
    private _root: Container;
    private _currentScreen: Screen | null = null;
    private _engine: MinimumEngine = MinimumEngine.getInstance();

    constructor() {
        this._root = new Container();
        
        MinimumEngine.getInstance().stage.addChild(this._root);
        Ticker.shared.add(this.update, this);
    }

    public async changeScreen(newScreen: Screen): Promise<void> {
        if (this._currentScreen) {
            this._currentScreen.exit();
            this._root.removeChild(this._currentScreen);
        }

        this._currentScreen = newScreen;

        if (!this._currentScreen['_initialized']) {
            await this._currentScreen.init();
        }

        this._root.addChild(this._currentScreen);
        this._currentScreen.enter();
        this._currentScreen.resize(this._engine.width, this._engine.height);
    }

    public resize(): void {
        if (!this._currentScreen) return;
        this._currentScreen.resize(this._engine.width, this._engine.height);
    }

    private update(ticker: Ticker): void {
        this._currentScreen?.update(ticker);
    }
}
