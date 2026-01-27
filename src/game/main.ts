import { Application } from 'pixi.js';
import { MinimumEngine, setEngine } from "./minimumEngine.ts";
import { MainScreen } from "./screens/mainScreen.ts";
import { ReloadButton } from "./reloadButton.ts";

// Wait for the iframe / DOM to fully load

window.addEventListener('load', async () => {

    // Create Pixi Application
    const app = new Application();

    // Initialize Pixi safely after DOM is ready
    await app.init({
        resizeTo: window,
        backgroundColor: 0xFFFFFF,
        preference: 'webgl'
    });

    // Append canvas to #app element
    document.getElementById('app')!.appendChild(app.canvas);

    // Setup engine
    const engine = new MinimumEngine(app);
    setEngine(engine);

    const canvas = app.canvas;

    // Add reload button
    const reloadButton = new ReloadButton(() => {
        window.location.reload();
    });
    reloadButton.position.set(window.innerWidth - reloadButton.width, 10);
    app.stage.addChild(reloadButton);

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
        engineResize();
    });


    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        console.log(`[Fullscreen] ${isFullscreen() ? 'ENTERED' : 'EXITED'}`);
        engineResize();
    });
    
    function engineResize(){
        requestAnimationFrame(() =>{
            engine.resize();
            reloadButton.position.set(window.innerWidth - reloadButton.width, 10);
        })
    }

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
    

    /** ---------- DEFAULT FULLSCREEN ---------- */
  //  requestFullscreen();

    // Show first screen
    engine.screenManager.changeScreen(new MainScreen());
});
