/**
 * Pouvoirs de la PLANTE.
 *
 *  • Semis — la Plante laisse des **bulbes** derrière elle. Un bulbe est à la
 *    fois une mine et une réserve : l'adversaire qui le frôle le fait éclater
 *    et prend la valeur de la statistique, la Plante qui le récupère se soigne
 *    d'autant. C'est exactement ce qu'annonce le libellé du HUD,
 *    « Bulb Damage/Heal » — le seul élément du roster capable de remonter ses
 *    points de vie. Un bulbe mûr tire aussi une fleur sur l'adversaire.
 *
 *  • Tempête de fleurs (ultime) — l'adversaire est enfermé dans un cerceau de
 *    lianes (le motif vert à nœuds clairs de la vidéo) et battu par une nuée
 *    de pétales roses ; la Plante se régénère pendant toute la durée.
 *
 * L'arme est également particulière : une **liane courbe**, dessinée ici en
 * tracé plutôt qu'en sprite droit (voir `drawWeapon`).
 *
 * @module game/abilities/plant
 */

import { TAU, clamp, dist } from '../../core/math.js';
import { drawSpriteCentered } from '../../render/sprites.js';
import { PIXEL_MAPS } from '../../data/pixelmaps.js';

export const plantAbilities = {
  id: 'plant',

  init(f) {
    /** @type {Array<{x:number,y:number,life:number,shoot:number,born:number}>} */
    f.state.bulbs = [];
    f.state.stormTick = 0;
    f.state.stormHeal = 0;
    f.state.cageAngle = 0;
  },

  update(f, dt, now, game) {
    const el = f.el;
    const b = el.ability.bulb;
    const target = f.opponent;

    /* ---------- bulbes ---------- */
    for (let i = f.state.bulbs.length - 1; i >= 0; i--) {
      const bulb = f.state.bulbs[i];
      bulb.life -= dt;
      if (bulb.life <= 0) {
        f.state.bulbs.splice(i, 1);
        continue;
      }

      // tant qu'il germe, le bulbe n'est actif pour personne
      const armed = bulb.life <= b.life - b.armDelay;

      // l'adversaire le fait éclater
      if (armed && target && target.alive && dist(bulb.x, bulb.y, target.x, target.y) <= b.radius + target.radius) {
        game.damage(target, b.damage(f), f, { kind: 'bulb', x: bulb.x, y: bulb.y });
        target.applySlow(b.slow, b.slowDuration, now);
        game.fx.burst(bulb.x, bulb.y, 16, {
          color: ['#4ade80', '#bbf7d0', '#f472b6'],
          speed: 240,
          size: 5,
          life: 0.5,
        });
        f.state.bulbs.splice(i, 1);
        continue;
      }

      // la Plante le récupère et se soigne
      if (armed && dist(bulb.x, bulb.y, f.x, f.y) <= b.radius + f.radius) {
        const healed = game.heal(f, b.heal(f), f);
        if (healed > 0) game.fx.ring(f.x, f.y, f.radius, f.radius * 1.7, 0.35, 'rgba(74,222,128,0.9)', 5, true);
        f.state.bulbs.splice(i, 1);
        continue;
      }

      // un bulbe mûr tire une fleur
      if (!armed || game.phase !== 'fight' || !target || !target.alive) continue;
      bulb.shoot -= dt;
      if (bulb.shoot <= 0) {
        bulb.shoot = b.shootInterval;
        if (dist(bulb.x, bulb.y, target.x, target.y) <= b.shootRange) {
          this.shootFrom(f, bulb, Math.atan2(target.y - bulb.y, target.x - bulb.x), game);
        }
      }
    }

    /* ---------- ultime ---------- */
    const ult = el.ultimate;
    if (f.ult.active > 0) {
      f.ult.active -= dt;
      f.state.cageAngle += ult.storm.cage.spin * dt;
      this.tickStorm(f, dt, now, game);
      if (f.ult.active <= 0) {
        f.ult.active = 0;
        f.ult.charge = 0;
        f.ult.ready = false;
      }
    } else if (game.phase === 'fight') {
      f.ult.charge = clamp(f.ult.charge + ult.chargeRate * dt, 0, 100);
      f.ult.ready = f.ult.charge >= 100;
      if (f.ult.ready) this.castStorm(f, game);
    }

    /* ---------- semis ---------- */
    if (game.phase !== 'fight') return;
    f.ability.timer -= dt;
    if (f.ability.timer <= 0) this.plantBulb(f, game);
  },

  plantBulb(f, game) {
    const a = f.el.ability;
    const b = a.bulb;
    f.state.bulbs.push({ x: f.x, y: f.y, life: b.life, shoot: b.shootInterval, born: game.time });
    if (f.state.bulbs.length > b.max) f.state.bulbs.shift();
    game.fx.burst(f.x, f.y, 8, { color: ['#4ade80', '#bbf7d0'], speed: 120, size: 4, life: 0.4 });
    f.ability.timer = a.cooldown;
  },

  /** Le tir part du bulbe, pas de la Plante. */
  shootFrom(f, bulb, angle, game) {
    const sx = f.x;
    const sy = f.y;
    f.x = bulb.x;
    f.y = bulb.y;
    game.projectiles.spawn(f, f.el.ability.bulb.projectile, angle, 18);
    f.x = sx;
    f.y = sy;
  },

  castStorm(f, game) {
    const ult = f.el.ultimate;
    f.ult.active = ult.duration;
    f.ult.ready = false;
    f.state.stormTick = 0;
    f.state.stormHeal = 0;
    const target = f.opponent;
    if (target) {
      game.fx.ring(target.x, target.y, 20, 220, 0.55, 'rgba(74,222,128,0.9)', 8, true);
    }
    game.shake(5, 0.3);
  },

  tickStorm(f, dt, now, game) {
    const storm = f.el.ultimate.storm;
    const target = f.opponent;

    // la Plante se régénère pendant sa tempête
    f.state.stormHeal -= dt;
    if (f.state.stormHeal <= 0) {
      f.state.stormHeal = storm.healInterval;
      game.heal(f, storm.healAmount, f);
    }

    if (!target || !target.alive) return;

    // cloué sur place par le cerceau de lianes
    target.applySlow(storm.root, 0.2, now);

    // nuée de pétales roses autour de la cible
    const p = storm.petals;
    if (game.rng.chance(dt * p.rate)) {
      const ang = game.rng.range(0, TAU);
      const rad = target.radius * game.rng.range(0.6, 2.4);
      game.fx.spawn({
        kind: 'spark',
        x: target.x + Math.cos(ang) * rad,
        y: target.y + Math.sin(ang) * rad,
        vx: game.rng.spread(p.speed),
        vy: game.rng.spread(p.speed),
        life: p.life * game.rng.range(0.6, 1.2),
        size: p.size * game.rng.range(0.5, 1.2),
        color: game.rng.pick(p.colors),
        drag: 2,
      });
    }

    f.state.stormTick -= dt;
    if (f.state.stormTick <= 0) {
      f.state.stormTick = storm.tickInterval;
      game.damage(target, storm.tickDamage(f), f, { kind: 'storm', silent: true });
    }
  },

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  /**
   * Liane courbe : un arc épais à contour noir, avec un reflet clair sur le
   * dessus et une pointe plus vive — le tracé remplace le sprite droit des
   * autres armes.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawWeapon(ctx, f) {
    const w = f.el.weapon;
    const v = w.vine;
    const h = w.handle;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.weaponAngle);

    // tige brune
    const half = h.width / 2;
    ctx.fillStyle = h.outline;
    ctx.fillRect(-2, -half - 2, h.length + 4, h.width + 4);
    ctx.fillStyle = h.color;
    ctx.fillRect(0, -half, h.length, h.width);
    ctx.fillStyle = h.dark;
    ctx.fillRect(0, 0, h.length, half);

    // arc de liane : rayon et angles déduits de la longueur et de l'ouverture
    const radius = v.length / v.curve;
    const cx = h.length;
    const cy = -radius; // centre de l'arc au-dessus de l'axe → la liane s'enroule
    ctx.lineCap = 'round';
    for (const pass of ['outline', 'body', 'light']) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI / 2, Math.PI / 2 - v.curve, true);
      if (pass === 'outline') {
        ctx.strokeStyle = v.outline;
        ctx.lineWidth = v.width + 6;
      } else if (pass === 'body') {
        ctx.strokeStyle = v.body;
        ctx.lineWidth = v.width;
      } else {
        ctx.strokeStyle = v.light;
        ctx.lineWidth = v.width * 0.34;
        ctx.beginPath();
        ctx.arc(cx, cy - v.width * 0.26, radius, Math.PI / 2, Math.PI / 2 - v.curve * 0.92, true);
      }
      ctx.stroke();
    }

    // bourgeon au bout
    const tipA = Math.PI / 2 - v.curve;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(tipA) * radius, cy + Math.sin(tipA) * radius, v.width * 0.42, 0, TAU);
    ctx.fillStyle = v.tip;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = v.outline;
    ctx.stroke();

    ctx.restore();
  },

  /** Bulbes posés au sol. */
  drawUnder(ctx, f) {
    const b = f.el.ability.bulb;
    const map = PIXEL_MAPS[b.sprite];
    const h = map.h * b.scale;
    for (const bulb of f.state.bulbs) {
      const fade = Math.min(1, bulb.life / 1.5);
      ctx.save();
      ctx.globalAlpha = fade;
      drawSpriteCentered(ctx, b.sprite, bulb.x, bulb.y, h);
      ctx.restore();
    }
  },

  /** Cerceau de lianes autour de la cible pendant la tempête. */
  drawOver(ctx, f) {
    if (f.ult.active <= 0) return;
    const cage = f.el.ultimate.storm.cage;
    const target = f.opponent;
    if (!target || !target.alive) return;

    const r = target.radius * cage.scale;
    const fade = Math.min(1, f.ult.active / 0.5);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(target.x, target.y);
    ctx.rotate(f.state.cageAngle);

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.strokeStyle = '#0d1f0a';
    ctx.lineWidth = cage.width + 5;
    ctx.stroke();
    ctx.strokeStyle = cage.color;
    ctx.lineWidth = cage.width;
    ctx.stroke();

    // nœuds clairs répartis sur le cerceau (observés sur la vidéo)
    const s = cage.width * 1.25;
    for (let i = 0; i < cage.studs; i++) {
      const a = (TAU * i) / cage.studs;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      ctx.fillStyle = '#0d1f0a';
      ctx.fillRect(x - s / 2 - 2, y - s / 2 - 2, s + 4, s + 4);
      ctx.fillStyle = cage.stud;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.restore();
  },

  barValue(f) {
    if (f.ult.active > 0) return f.ult.active / f.el.ultimate.duration;
    return f.ult.charge / 100;
  },
};
