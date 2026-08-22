/**
 * Pouvoirs du VENT.
 *
 *  • Tornade — une **rafale tournoyante déclenchée autour de lui**, pas un
 *    vortex lancé au loin. Détection automatique sur trois vidéos : elle ne
 *    dure que 4 à 6 images (0,13 → 0,20 s) et son centre reste à moins de
 *    30 px du Vent. Elle projette violemment ce qu'elle attrape.
 *
 *    Elle part sur une recharge qui **se raccourcit de 4 s à 0,5 s**, et les
 *    deux compteurs du HUD avancent ensemble (+2 dégâts, −0,5 s) — mais
 *    seulement quand la rafale **touche** : on compte 17 déclenchements pour
 *    7 progressions sur un même duel, et les incantations qui ne rapportent
 *    rien sont précisément celles où l'adversaire était hors de portée.
 *
 *  • Salve de tempête (ultime) — décharge courte et dense de croissants
 *    d'air : sur la vidéo, la cible perd ~16 PV en une seconde et demie au
 *    moment où la jauge se vide.
 *
 * @module game/abilities/wind
 */

import { TAU, clamp } from '../../core/math.js';

export const windAbilities = {
  id: 'wind',

  init(f) {
    /** @type {Array<{x:number,y:number,r:number,life:number,max:number,angle:number}>} */
    f.state.gusts = [];
    f.state.volleyTimer = 0;
  },

  update(f, dt, now, game) {
    const el = f.el;

    // les rafales ne vivent qu'une fraction de seconde
    for (let i = f.state.gusts.length - 1; i >= 0; i--) {
      const g = f.state.gusts[i];
      g.life -= dt;
      g.angle += 14 * dt;
      if (g.life <= 0) f.state.gusts.splice(i, 1);
    }

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
    if (f.ability.timer <= 0) this.castTornado(f, now, game);
  },

  castTornado(f, now, game) {
    const a = f.el.ability;
    const t = a.tornado;
    const target = f.opponent;

    f.state.gusts.push({ x: f.x, y: f.y, r: t.radius, life: t.duration, max: t.duration, angle: 0 });
    game.fx.ring(f.x, f.y, 20, t.radius, 0.3, t.edge, 6, true);
    for (let i = 0; i < 14; i++) {
      const ang = game.rng.range(0, TAU);
      game.fx.spawn({
        kind: 'dot',
        x: f.x + Math.cos(ang) * t.radius * 0.7,
        y: f.y + Math.sin(ang) * t.radius * 0.7,
        vx: -Math.sin(ang) * 260,
        vy: Math.cos(ang) * 260,
        life: 0.35,
        size: 3,
        color: '#cfc6a8',
        drag: 1.6,
      });
    }

    // la rafale ne blesse que si l'adversaire est pris dedans
    let landed = false;
    if (target && target.alive) {
      const dx = target.x - f.x;
      const dy = target.y - f.y;
      const d = Math.hypot(dx, dy);
      if (d <= t.radius + target.radius) {
        landed = true;
        game.damage(target, t.damage(f), f, {
          kind: 'tornado',
          x: target.x,
          y: target.y,
          nx: dx / (d || 1),
          ny: dy / (d || 1),
          knockback: t.knockback,
        });
      }
    }

    // la cadence s'accélère à chaque rafale…
    let cd = f.ability.cooldown - a.cooldownStepOnCast;
    // …et une rafale qui touche fait avancer le couple affiché d'un cran
    if (landed) {
      f.stacks = Math.min(t.damageMax, f.stacks + t.damageGain);
      cd -= a.cooldownStep;
    }
    f.ability.cooldown = Math.max(a.cooldownFloor, cd);
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

  /** Rafale : un tourbillon de lames d'air, très bref. */
  drawUnder(ctx, f) {
    const t = f.el.ability.tornado;
    for (const g of f.state.gusts) {
      const k = g.life / g.max; // 1 → 0
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 1.4);
      ctx.translate(g.x, g.y);
      ctx.rotate(g.angle);

      const r = g.r * (0.65 + 0.35 * (1 - k)); // le tourbillon s'ouvre
      const grad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
      grad.addColorStop(0, 'rgba(240,234,214,0.9)');
      grad.addColorStop(1, t.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.fill();

      // lames d'air enroulées
      ctx.strokeStyle = t.edge;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let i = 0; i < t.blades; i++) {
        const a0 = (TAU * i) / t.blades;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.62, a0, a0 + 1.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.9, a0 + 0.5, a0 + 1.5);
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
