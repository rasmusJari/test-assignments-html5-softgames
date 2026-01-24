export const Easing = {
    // Linear
    linear: (t: number): number => t,

    // Quadratic
    easeInQuad: (t: number): number => t * t,
    easeOutQuad: (t: number): number => t * (2 - t),
    easeInOutQuad: (t: number): number =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    // Cubic
    easeInCubic: (t: number): number => t * t * t,
    easeOutCubic: (t: number): number => --t * t * t + 1,
    easeInOutCubic: (t: number): number =>
        t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    // Quartic
    easeInQuart: (t: number): number => t * t * t * t,
    easeOutQuart: (t: number): number => 1 - --t * t * t * t,

    // Quintic
    easeInQuint: (t: number): number => t * t * t * t * t,
    easeOutQuint: (t: number): number => 1 + --t * t * t * t * t,

    // Sine
    easeInSine: (t: number): number =>
        1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: (t: number): number =>
        Math.sin((t * Math.PI) / 2),
    easeInOutSine: (t: number): number =>
        -(Math.cos(Math.PI * t) - 1) / 2,

    // Back (overshoot)
    easeOutBack: (t: number): number => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    // Elastic (bounce at end)
    easeOutElastic: (t: number): number => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
            ? 0
            : t === 1
                ? 1
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
};
