import * as PIXI from 'pixi.js';
import {Vector2} from "@esotericsoftware/spine-pixi-v8";
import {Ticker} from "pixi.js";

// 1️⃣ Create PixiJS app
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

// 2️⃣ Create a ParticleContainer
const particleContainer = new PIXI.ParticleContainer();
particleContainer.scale.set(0.2, 0.2);
particleContainer.position.set(500, 300);
particleContainer.batched = true;
particleContainer.alpha = 1;
particleContainer.tint = 0xffffff;
/*
10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
});
 */
app.stage.addChild(particleContainer);

// 3️⃣ Load particle texture
const texture = PIXI.Texture.from('particle.png'); // small particle image

// 4️⃣ Define particle interface
interface Particle {
    sprite: PIXI.Sprite;
    velocity: Vector2;
    lifetime: number; // in seconds
}

// 5️⃣ Array to hold particles
const particles: Particle[] = [];

// 6️⃣ Create a new particle
function createParticle(x: number, y: number) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(Math.random() * 0.5 + 0.1);
    sprite.rotation = Math.random() * Math.PI * 2;
    sprite.alpha = 1;

    const velocity = new Vector2(10, 5);
    particles.push({ sprite, velocity, lifetime: 2 }); // 2-second lifetime
    particleContainer.addChild(sprite);
}

// 7️⃣ Add some initial particles
for (let i = 0; i < 100; i++) {
    createParticle(app.renderer.width / 2, app.renderer.height / 2);
}

// 8️⃣ Update loop
app.ticker.add((ticker: Ticker) => {
    const dt = ticker.deltaTime / 60; // delta in seconds (assuming 60 FPS)

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // move particle
        p.sprite.x += p.velocity.x * dt;
        p.sprite.y += p.velocity.y * dt;
        // fade out
        p.sprite.alpha -= dt / p.lifetime;
        // rotate
        p.sprite.rotation += 0.1 * dt;

        // remove particle if alpha <= 0
        if (p.sprite.alpha <= 0) {
            particleContainer.removeChild(p.sprite);
            particles.splice(i, 1);
        }
    }
});

// 9️⃣ Spawn particles on mouse move
app.stage.interactive = true;
app.stage.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
    const { x, y } = event.global; // use `event.global` instead of event.data.global
    for (let i = 0; i < 5; i++) {
        createParticle(x, y);
    }
});