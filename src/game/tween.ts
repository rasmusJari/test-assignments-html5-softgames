import { Ticker } from 'pixi.js';

/** Optional easing functions */
export type EasingFunction = (t: number) => number;

export class Tween {
    private _target: any;
    private _from: { [key: string]: number } = {};
    private _to: { [key: string]: number } = {};
    private _duration: number; // seconds
    private _elapsed: number = 0;
    private _onComplete?: () => void;
    private _easing: EasingFunction;

    private _running = false;

    constructor(
        target: any,
        to: { [key: string]: number },
        duration: number,
        easing: EasingFunction = (t) => t, // linear by default
        onComplete?: () => void
    ) {
        this._target = target;
        this._duration = duration;
        this._to = to;
        this._onComplete = onComplete;
        this._easing = easing;

        // save starting values
        for (const key in to) {
            if (target[key] === undefined) {
                throw new Error(`Target does not have property "${key}"`);
            }
            this._from[key] = target[key];
        }
    }

    /** Start the tween */
    public start(): void {
        if (this._running) return;
        this._running = true;
        Ticker.shared.add(this._update, this);
    }

    /** Stop the tween */
    public stop(): void {
        if (!this._running) return;
        Ticker.shared.remove(this._update, this);
        this._running = false;
    }

    private _update(ticker: Ticker): void {
        this._elapsed += ticker.deltaTime / Ticker.shared.FPS; // approximate seconds
        const tRaw = Math.min(this._elapsed / this._duration, 1);
        const t = this._easing(tRaw);

        for (const key in this._to) {
            this._target[key] = this._from[key] + (this._to[key] - this._from[key]) * t;
        }

        if (tRaw >= 1) {
            this.stop();
            this._onComplete?.();
        }
    }
}
