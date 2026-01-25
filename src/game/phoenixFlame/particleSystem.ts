import { ParticleContainer, Particle, Texture } from 'pixi.js';
import {randomRange} from "../../engine/utils/random.ts";
import {lerp} from "../../engine/utils/maths.ts";
import {lerpColorSafe} from "../ColorLerp.ts";


interface MyParticle {
    particle: Particle;
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
    active: boolean;
    rotationSpeed: number;
    onComplete?: () => void;
}

export class ParticleSystem {
    private _particles: MyParticle[] = [];
    private _container: ParticleContainer;
    private _texture: Texture;
    private _maxParticles: number;
    private _emitterTimer = 0;
    private _emitterRate = 0.05; // seconds per spawn
    private _emitterX = 0;
    private _emitterY = 0;
    private _rotationSpeed = 0;

    constructor(container: ParticleContainer, texture: Texture, maxParticles = 500) {
        this._container = container;
        this._texture = texture;
        this._maxParticles = maxParticles;
        this._container.blendMode = 'add';

        // Pre-create particle pool
        for (let i = 0; i < this._maxParticles; i++) {
            const particle = new Particle({
                texture: this._texture,
                x: 0,
                y: 0,
                scaleX: 0.3,
                scaleY: 0.3,
                rotation: 0,
                alpha: 0,
                anchorX: 0.5,
                anchorY: 0.5
            });

            this._container.addParticle(particle);

            this._particles.push({
                particle,
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
                active: false,
                rotationSpeed: 0,
            });
        }
    }

    /** Set emitter position (for automatic spawning) */
    public setEmitterPosition(x: number, y: number) {
        this._emitterX = x;
        this._emitterY = y;
    }

    /** Set particle spawn rate (seconds per particle) */
    public setEmitterRate(rate: number) {
        this._emitterRate = rate;
    }

    /** Spawn a particle manually or reuse an inactive one */
    public spawn(
        x: number,
        y: number,
        lifetime = 2,
        velocityX?: number,
        velocityY: number = -300,
        startColor = 0xffa53d,
        endColor = 0xffa53d,
        startAlpha = 1,
        endAlpha = 0,
        startScale = 0.5,
        endScale = 0,
        rotationSpeed = 2,
        onComplete?: () => void
    ) {
        let p = this._particles.find(p => !p.active);

        // If no inactive particle, recycle the oldest
        if (!p) {
            p = this._particles.reduce((oldest, curr) =>
                curr.age > oldest.age ? curr : oldest
            );
        }

        // Initialize particle
        p.particle.x = x;
        p.particle.y = y;
        p.particle.alpha = startAlpha;
        p.particle.scaleX = p.particle.scaleY = startScale;
        p.particle.rotation = Math.random() * Math.PI * 2;
        p.rotationSpeed = rotationSpeed;

        p.velocityX = velocityX ?? (Math.random() - 0.5) * 200;
        p.velocityY = velocityY ?? -500;
        p.lifetime = lifetime;
        p.age = 0;
        p.startColor = startColor;
        p.endColor = endColor;
        p.startAlpha = startAlpha;
        p.endAlpha = endAlpha;
        p.startScale = startScale;
        p.endScale = endScale;
        p.active = true;
        p.onComplete = onComplete;

        p.particle.alpha = p.startAlpha;
    }

    /** Update all particles and automatic emitter */
    public update(dt: number) {
        // Automatic emitter
        this._emitterTimer += dt;
        while (this._emitterTimer >= this._emitterRate) {
            this._emitterTimer -= this._emitterRate;
            this.spawn(
                this._emitterX + randomRange(-2, 2),
                this._emitterY + randomRange(-2, 2)
            );
        }

        // Update particles
        for (const p of this._particles) {
            if (!p.active) continue;

            p.age += dt;
            p.lifetime -= dt;
            const t = (1 - p.lifetime) / p.lifetime;

            p.particle.x += p.velocityX * dt;
            p.particle.y += p.velocityY * dt;
            p.particle.rotation += p.rotationSpeed * dt;
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

    /** Remove all particles */
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
