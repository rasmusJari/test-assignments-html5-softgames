import { setEngine } from "./app/getEngine";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register their plugins with the engine.
 */
import "@pixi/sound";
import { MainScreen } from "./app/screens/main/MainScreen.ts";
import { Application } from "pixi.js";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

/** ---------- FULLSCREEN HELPERS ---------- */

function isFullscreen(canvas: HTMLCanvasElement): boolean {
  return document.fullscreenElement === canvas;
}

async function toggleFullscreen(canvas: HTMLCanvasElement) {
  if (!document.fullscreenElement) {
    await canvas.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function logFullscreenState(canvas: HTMLCanvasElement) {
  const isFs = isFullscreen(canvas);
  console.log(
      `[Fullscreen] ${isFs ? "ENTERED" : "EXITED"}`,
      {
        fullscreenElement: document.fullscreenElement,
        canvasSize: {
          w: canvas.clientWidth,
          h: canvas.clientHeight
        },
        windowSize: {
          w: window.innerWidth,
          h: window.innerHeight
        }
      }
  );
}

/** ---------- APP BOOTSTRAP ---------- */

(async () => {
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: {
      minWidth: 768,
      minHeight: 1024,
      letterbox: false
    }
  });

  const canvas = engine.canvas;

  /** ---- FULLSCREEN DEBUG LISTENER ---- */
  document.addEventListener("fullscreenchange", () => {
    logFullscreenState(canvas);
  });

  /** ---- FULLSCREEN TOGGLE (KEYBOARD) ---- */
  window.addEventListener("keydown", (e) => {
    if (e.key === "f") {
      toggleFullscreen(canvas);
    }
  });

  /** ---- OPTIONAL: DOUBLE CLICK CANVAS ---- */
  canvas.addEventListener("dblclick", () => {
    toggleFullscreen(canvas);
  });

  /** ---- OPTIONAL: START IN FULLSCREEN ---- */
  try {
    await canvas.requestFullscreen();
    console.log("[Fullscreen] Requested on startup");
  } catch (e) {
    console.warn("[Fullscreen] Autostart blocked by browser");
  }

  // Initialize user settings
  userSettings.init();

  // Show main screen
  await engine.navigation.showScreen(MainScreen);
})();
