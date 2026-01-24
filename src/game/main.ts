import { Application } from 'pixi.js';
import {MinimumEngine, setEngine} from "./minimumEngine.ts";
import {MainScreen} from "./screens/mainScreen.ts";

const app = new Application();

await app.init({
    resizeTo: window,
    backgroundColor: 0xFFFFFF,preference: 'webgl'
});

document.getElementById('app')!.appendChild(app.canvas);

const engine = new MinimumEngine(app);
setEngine(engine);
// Show first screen
engine.screenManager.changeScreen(new MainScreen());

window.addEventListener('resize', () => {
    engine.resize();
});

app.ticker.add((delta) => {
    // Game loop logic can go here if needed
});

