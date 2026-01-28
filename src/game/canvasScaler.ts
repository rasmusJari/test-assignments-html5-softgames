import {Container} from "pixi.js";

/// Scales and centers the main canvas within the given width and height while maintaining aspect ratio.
export function scaleCanvas(width: number, height: number, container: Container<any>): void {
    // Reference resolution
    const DESIGN_WIDTH = 800;
    const DESIGN_HEIGHT = 600;
    
    // Calculate scale ratios
    const scaleX = width / DESIGN_WIDTH;
    const scaleY = height / DESIGN_HEIGHT;

    // Keep aspect ratio
    const scale = Math.min(scaleX, scaleY);

    container.scale.set(scale);

    // Center it
    container.x = (width - DESIGN_WIDTH * scale) / 2;
    container.y = (height - DESIGN_HEIGHT * scale) / 2;
}