import { Application } from 'pixi.js';
import { MinimumEngine, setEngine } from "./minimumEngine.ts";
import { MainScreen } from "./screens/mainScreen.ts";

const app = new Application();

await app.init({
    resizeTo: window,
    backgroundColor: 0xFFFFFF,
    preference: 'webgl'
});

document.getElementById('app')!.appendChild(app.canvas);

const engine = new MinimumEngine(app);
setEngine(engine);



const canvas = app.canvas;

/** ---------- FULLSCREEN HELPERS ---------- */

function isFullscreen(): boolean {
    return document.fullscreenElement === canvas;
}

async function requestFullscreen() {
    if (!document.fullscreenElement) {
        try {
            await canvas.requestFullscreen();
            console.log('[Fullscreen] Entered');
        } catch {
            console.warn('[Fullscreen] Blocked by browser (user gesture required)');
        }
    }
}

async function toggleFullscreen() {
    if (isFullscreen()) {
        await document.exitFullscreen();
    } else {
        await requestFullscreen();
    }
}

/** ---------- EVENTS ---------- */

// Resize Pixi properly
window.addEventListener('resize', () => {
    engine.resize();
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    console.log(`[Fullscreen] ${isFullscreen() ? 'ENTERED' : 'EXITED'}`);
    engine.resize();
});

// Keyboard toggle (fallback)
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
    }
});

// Click once to guarantee fullscreen (important!)
canvas.addEventListener('click', () => {
    requestFullscreen();
}, { once: true });

/** ---------- TICKER ---------- */

app.ticker.add(() => {
    // Game loop
});

/** ---------- DEFAULT FULLSCREEN ---------- */

// Try immediately
requestFullscreen();

// Show first screen
engine.screenManager.changeScreen(new MainScreen());