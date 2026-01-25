/**
 * Linearly interpolates between two hex colors safely.
 * Works with PixiJS Particle.tint or Sprite.tint
 *
 * @param color1 Start color (0xRRGGBB)
 * @param color2 End color (0xRRGGBB)
 * @param t Interpolation factor (0..1)
 * @returns Interpolated color as 0xRRGGBB
 */
export function lerpColorSafe(color1: number, color2: number, t: number): number {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Extract RGB components
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    // Lerp each channel
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    // Combine back into hex
    return (r << 16) | (g << 8) | b;
}
