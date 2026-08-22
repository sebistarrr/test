/**
 * Pouvoirs du VENT.
 *
 *  • Tornade — un vortex posé sur l'adversaire qui l'aspire et le blesse.
 *    Chaque incantation renforce la tornade (« Tornado Damage » +2) et
 *    raccourcit la recharge (4 s → 1 s), exactement comme sur la vidéo : les
 *    deux compteurs du HUD bougent ensemble.
 *
 *  • Salve de tempête (ultime) — pluie de croissants d'air et pointe de
 *    vitesse pendant toute la durée.
 *
 * @module game/abilities/wind
 */

import { TAU, clamp } from '../../core/math.js';
import { tickZones } from './zone.js';

export const windAbilities = {
  id: 'wind',

  init(f) {
    /** @type {Array<{x:number,y:number,r:number,life:number,angle:number,tick:number}>} */
    f.state.tornados = [];
    f.state.volleyTimer = 0;
  },

  update(f, dt, now, game) {
    const el = f.el;
    const t = el.ability.tornado;

    // entretien des tornades en cours
    tickZones(f.state.tornados, f, dt, now, game, {
      pull: t.pull,
      tickInterval: t.tickInterval,
      tickDamage: t.tickDamage(f),
      kind: 'tornado',
      sparkColor: '#e6dcc0',
      spin: 3,
    });

    /* ---------- ultime ---------- */
    const ult = el.ultimate;
    if (f.ult.active > 0) {
      f.ult.active -= dt;
      f.state.volleyTimer -= dt;
      if (f.state.volleyTimer <= 0) {
        f.state.volleyTimer = ult.volley.interval;
        this.fireVolley(f, game);
      }
      if (f.ult.active <= 0) {
        f.ult.active = 0;
        f.ult.charge = 0;
        f.ult.ready = false;
        f.boost = 0;
      }
    } else if (game.phase === 'fight') {
      f.ult.charge = clamp(f.ult.charge + ult.chargeRate * dt, 0, 100);
      f.ult.ready = f.ult.charge >= 100;
      if (f.ult.ready) this.castVolley(f, game);
    }

    /* ---------- tornade ---------- */
    if (game.phase !== 'fight') return;
    f.ability.timer -= dt;
    if (f.ability.timer <= 0) this.castTornado(f, game);
  },

  castTornado(f, game) {
    const a = f.el.ability;
    const t = a.tornado;
    const target = f.opponent;
    // la tornade tombe sur l'adversaire (ou devant soi s'il n'y en a plus)
    const x = target && target.alive ? target.x : f.x + Math.cos(f.heading) * 160;
    const y = target && target.alive ? target.y : f.y + Math.sin(f.heading) * 160;

    f.state.tornados.push({ x, y, r: t.radius, life: t.duration, angle: 0, tick: 0 });
    game.fx.ring(x, y, 20, t.radius, 0.4, t.edge, 6, true);
    for (let i = 0; i < 18; i++) {
      const ang = game.rng.range(0, TAU);
      game.fx.spawn({
        kind: 'dot',
        x: x + Math.cos(ang) * t.radius * 0.8,
        y: y + Math.sin(ang) * t.radius * 0.8,
        vx: -Math.sin(ang) * 150,
        vy: Math.cos(ang) * 150,
        life: 0.6,
        size: 3,
        color: '#cfc6a8',
        drag: 1.2,
      });
    }

    // les deux compteurs du HUD progressent ensemble (mesuré),
    // la puissance de la tornade plafonnant comme dans la vidéo
    f.stacks = Math.min(t.damageMax, f.stacks + t.damageGain);
    f.ability.cooldown = Math.max(a.cooldownFloor, f.ability.cooldown - a.cooldownStep);
    f.ability.timer = f.ability.cooldown;
  },

  castVolley(f, game) {
    const ult = f.el.ultimate;
    f.ult.active = ult.duration;
    f.ult.ready = false;
    f.state.volleyTimer = 0;
    f.boost = ult.duration;
    f.boostFactor = ult.speedBonus;
    game.fx.ring(f.x, f.y, 20, 320, 0.5, 'rgba(214,205,170,0.9)', 7, true);
    game.shake(4, 0.25);
  },

  fireVolley(f, game) {
    const v = f.el.ultimate.volley;
    const target = f.opponent;
    const base = target && target.alive ? Math.atan2(target.y - f.y, target.x - f.x) : f.heading;
    for (let i = 0; i < v.count; i++) {
      const off = v.count === 1 ? 0 : (i / (v.count - 1) - 0.5) * v.spread;
      game.projectiles.spawn(f, v.projectile, base + off);
    }
  },

  /** Vortex translucide : anneaux concentriques qui tournent. */
  drawUnder(ctx, f) {
    const t = f.el.ability.tornado;
    for (const z of f.state.tornados) {
      const fade = Math.min(1, z.life / 0.5);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(z.x, z.y);
      ctx.rotate(z.angle);

      const g = ctx.createRadialGradient(0, 0, z.r * 0.15, 0, 0, z.r);
      g.addColorStop(0, 'rgba(232,225,200,0.65)');
      g.addColorStop(1, t.color);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, z.r, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = t.edge;
      ctx.lineWidth = 3;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, z.r * (i / 3.2), z.r * (i / 4.6), z.angle * (i % 2 ? 1 : -1), 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  drawOver() {},

  barValue(f) {
    if (f.ult.active > 0) return f.ult.active / f.el.ultimate.duration;
    return f.ult.charge / 100;
  },
};
