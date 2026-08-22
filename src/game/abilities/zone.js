/**
 * Zones d'effet circulaires (tornade, tourbillon, maelström).
 *
 * Une zone est un objet simple `{x, y, r, life, born}` : le module de pouvoirs
 * la crée, ce helper l'entretient (aspiration, dégâts périodiques, expiration)
 * et le module se charge du rendu, propre à chaque élément.
 *
 * @module game/abilities/zone
 */

import { TAU } from '../../core/math.js';

/**
 * @param {Array<any>} zones
 * @param {import('../fighter.js').Fighter} owner
 * @param {number} dt
 * @param {number} now
 * @param {import('../match.js').Match} game
 * @param {{pull:number, tickInterval:number, tickDamage:number, kind:string,
 *          sparkColor?:string}} spec
 */
export function tickZones(zones, owner, dt, now, game, spec) {
  const target = owner.opponent;
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i];
    z.life -= dt;
    if (z.life <= 0) {
      zones.splice(i, 1);
      continue;
    }
    z.angle = (z.angle ?? 0) + (spec.spin ?? 2) * dt;
    if (!target || !target.alive) continue;

    const dx = z.x - target.x;
    const dy = z.y - target.y;
    const d = Math.hypot(dx, dy);
    if (d > z.r + target.radius) continue;

    // aspiration vers le centre, d'autant plus forte qu'on est proche
    const grip = 1 - Math.min(1, d / Math.max(1, z.r));
    target.push(dx, dy, spec.pull * grip * dt * 60);

    z.tick = (z.tick ?? 0) - dt;
    if (z.tick <= 0) {
      z.tick = spec.tickInterval;
      game.damage(target, spec.tickDamage, owner, { kind: spec.kind, silent: true });
      if (spec.sparkColor) {
        game.fx.burst(target.x, target.y, 4, {
          color: spec.sparkColor,
          speed: 110,
          size: 4,
          life: 0.35,
        });
      }
    }
  }
}

/**
 * Spirale pixelisée : bras qui s'enroulent, utilisée pour l'eau.
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawSpiral(ctx, x, y, r, angle, { arms = 3, color, width = 5, turns = 1.2 }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  for (let a = 0; a < arms; a++) {
    ctx.beginPath();
    const offset = (TAU * a) / arms;
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const rad = r * (0.12 + 0.88 * t);
      const th = offset + t * TAU * turns;
      const px = Math.cos(th) * rad;
      const py = Math.sin(th) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}
