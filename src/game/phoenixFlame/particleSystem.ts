import { ParticleContainer, Particle, Texture } from 'pixi.js';
import { lerp } from '../../engine/utils/maths.ts';
import { lerpColorSafe } from '../ColorLerp.ts';
import {randomRange} from "../../engine/utils/random.ts";

export interface ParticleConfig {
    x: number;
    y: number;
    velocityXMin?: number;
    velocityXMax?: number;
    velocityYMin?: number;
    velocityYMax?: number;
    lifetime?: number;
    startColor?: number;
    endColor?: number;
    startAlpha?: number;
    endAlpha?: number;
    startScale?: number;
    endScale?: number;
    rotation?: number;
    onComplete?: () => void;
}

interface MyParticle {
    particle: Particle;
    velocityXMin: number;
    velocityXMax: number;
    velocityYMin: number;
    velocityYMax: number;
    velocityX: number;
    velocityY: number;
    lifetime: number;
    age: number;
    startColor: number;
    endColor: number;
    startAlpha: number;
    endAlpha: number;
    startScale: number;
    endScale: number;
    rotation: number;
    active: boolean;
    onComplete?: () => void;
}

export class ParticleSystem {
    private _particles: MyParticle[] = [];
    private _container: ParticleContainer;
    private _texture: Texture;
    private _maxParticles: number;
    private _emitterTimer = 0;
    private _emitterRate = 0.05; // seconds per particle
    private _emitterX = 0;
    private _emitterY = 0;
    private _defaultConfig: Partial<ParticleConfig> = {};

    constructor(container: ParticleContainer, texture: Texture, maxParticles = 500) {
        this._container = container;
        this._texture = texture;
        this._maxParticles = maxParticles;
        this._container.blendMode = 'add';

        // Pre-create particle pool
        for (let i = 0; i < maxParticles; i++) {
            const particle = new Particle({
                texture: texture,
                x: 0,
                y: 0,
                alpha: 0,
                scaleX: 0.3,
                scaleY: 0.3,
                rotation: 0,
                anchorX: 0.5,
                anchorY: 0.5,
            });

            this._container.addParticle(particle);

            this._particles.push({
                particle,
                velocityXMin: 0,
                velocityXMax: 0,
                velocityYMin: 0,
                velocityYMax: 0,
                velocityX: 0,
                velocityY: 0,
                lifetime: 0,
                age: 0,
                startColor: 0xffffff,
                endColor: 0xffffff,
                startAlpha: 1,
                endAlpha: 0,
                startScale: 0.3,
                endScale: 0,
                rotation: 0,
                active: false,
            });
        }
    }

    /** Set default config used for all particles unless overridden */
    public setDefaultConfig(config: Partial<ParticleConfig>) {
        this._defaultConfig = config;
    }

    /** Set emitter position for continuous emission */
    public setEmitterPosition(x: number, y: number) {
        this._emitterX = x;
        this._emitterY = y;
    }

    /** Set particle spawn rate (seconds per particle) */
    public setEmitterRate(rate: number) {
        this._emitterRate = rate;
    }

    /** Spawn a particle using external config */
    public spawn(config: ParticleConfig) {
        let p = this._particles.find(p => !p.active);

        // If no inactive particle, recycle the oldest
        if (!p) {
            p = this._particles.reduce((oldest, curr) =>
                curr.age > oldest.age ? curr : oldest
            );
        }

        const fullConfig: ParticleConfig = { ...this._defaultConfig, ...config };

        p.particle.x = fullConfig.x;
        p.particle.y = fullConfig.y;
        p.particle.alpha = fullConfig.startAlpha ?? 1;
        p.particle.scaleX = p.particle.scaleY = fullConfig.startScale ?? 0.3;
        p.particle.rotation = fullConfig.rotation ?? Math.random() * Math.PI * 2;

        p.velocityXMin = fullConfig.velocityXMin ?? 0;
        p.velocityXMax = fullConfig.velocityXMax ?? 0;
        p.velocityYMin = fullConfig.velocityYMin ?? 0;
        p.velocityYMax = fullConfig.velocityYMax ?? 0;
        p.velocityX = randomRange(p.velocityXMin, p.velocityXMax);
        p.velocityY = randomRange(p.velocityYMin, p.velocityYMax);
        
        p.lifetime = fullConfig.lifetime ?? 1;
        p.age = 0;
        p.startColor = fullConfig.startColor ?? 0xffffff;
        p.endColor = fullConfig.endColor ?? 0xffffff;
        p.startAlpha = fullConfig.startAlpha ?? 1;
        p.endAlpha = fullConfig.endAlpha ?? 0;
        p.startScale = fullConfig.startScale ?? 0.3;
        p.endScale = fullConfig.endScale ?? 0;
        p.rotation = fullConfig.rotation ?? 0;
        p.active = true;
        p.onComplete = fullConfig.onComplete;

        p.particle.alpha = p.startAlpha;
    }

    /** Update all particles and automatic emitter */
    public update(dt: number) {
        // Continuous emitter
        this._emitterTimer += dt;
        while (this._emitterTimer >= this._emitterRate) {
            this._emitterTimer -= this._emitterRate;
            this.spawn({ x: this._emitterX, y: this._emitterY });
        }

        // Update all active particles
        for (const p of this._particles) {
            if (!p.active) continue;

            p.age += dt;
            const t = Math.min(p.age / p.lifetime, 1);

            // Update particle properties
            p.particle.x += p.velocityX * dt;
            p.particle.y += p.velocityY * dt;
            p.particle.rotation += 0.1 * dt;
            p.particle.alpha = lerp(p.startAlpha, p.endAlpha, t);
            p.particle.scaleX = p.particle.scaleY = lerp(p.startScale, p.endScale, t);
            p.particle.tint = lerpColorSafe(p.startColor, p.endColor, t);

            if (p.age >= p.lifetime) {
                p.active = false;
                p.particle.alpha = 0;
                p.onComplete?.();
            }
        }

        this._container.update();
    }

    /** Clear all particles */
    public clear() {
        for (const p of this._particles) {
            p.active = false;
            p.particle.alpha = 0;
        }
    }

    /** Count active particles */
    public count(): number {
        return this._particles.filter(p => p.active).length;
    }
}
