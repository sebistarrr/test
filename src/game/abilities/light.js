/**
 * Pouvoirs de la LUMIÈRE.
 *
 *  • Égide — un bouclier permanent absorbe les dégâts et **riposte** :
 *    c'est la statistique « Shield Damage » du HUD. Il se régénère après un
 *    répit, et l'incantation le recharge d'un coup en repoussant l'adversaire.
 *
 *  • Piège radiant (ultime) — le double trait doré de la vidéo : il relie la
 *    Lumière à sa cible, la teinte de sa propre couleur, la ralentit fortement,
 *    la tire vers elle et la draine.
 *
 * La seconde statistique, « Knockback », monte de 300 par touche (mesuré
 * 1500 → 5400) et pilote directement la force de projection du marteau.
 *
 * @module game/abilities/light
 */

import { clamp } from '../../core/math.js';

export const lightAbilities = {
  id: 'light',

  init(f) {
    const shield = f.el.ability.shield;
    f.shieldMax = shield.capacity(f);
    f.shield = f.shieldMax;
    f.state.regenDelay = 0;
    f.state.reflectCd = 0;
    f.state.snareTick = 0;
  },

  update(f, dt, now, game) {
    const el = f.el;
    const shield = el.ability.shield;

    /* ---------- bouclier ---------- */
    f.shieldMax = shield.capacity(f);
    f.state.regenDelay = Math.max(0, f.state.regenDelay - dt);
    f.state.reflectCd = Math.max(0, f.state.reflectCd - dt);
    if (f.state.regenDelay <= 0 && f.shield < f.shieldMax) {
      f.shield = Math.min(f.shieldMax, f.shield + shield.regen * dt);
    }

    /* ---------- ultime ---------- */
    const ult = el.ultimate;
    if (f.ult.active > 0) {
      f.ult.active -= dt;
      this.tickSnare(f, dt, now, game);
      if (f.ult.active <= 0) {
        f.ult.active = 0;
        f.ult.charge = 0;
        f.ult.ready = false;
      }
    } else if (game.phase === 'fight') {
      f.ult.charge = clamp(f.ult.charge + ult.chargeRate * dt, 0, 100);
      f.ult.ready = f.ult.charge >= 100;
      if (f.ult.ready) this.castSnare(f, game);
    }

    /* ---------- égide ---------- */
    if (game.phase !== 'fight') return;
    f.ability.timer -= dt;
    if (f.ability.timer <= 0) this.castAegis(f, game);
  },

  castAegis(f, game) {
    const a = f.el.ability;
    f.shield = f.shieldMax;
    f.state.regenDelay = 0;

    const target = f.opponent;
    if (target && target.alive) {
      const d = Math.hypot(target.x - f.x, target.y - f.y);
      if (d <= a.pulse.radius + target.radius) {
        game.damage(target, a.pulse.damage, f, {
          kind: 'melee',
          x: target.x,
          y: target.y,
          nx: (target.x - f.x) / (d || 1),
          ny: (target.y - f.y) / (d || 1),
          knockback: a.pulse.knockback,
        });
      }
    }
    game.fx.ring(f.x, f.y, f.radius, a.pulse.radius, 0.45, 'rgba(250,220,60,0.9)', 8, true);
    game.fx.burst(f.x, f.y, 18, { color: ['#facc15', '#ffffff'], speed: 300, size: 6, life: 0.5 });
    f.ability.timer = a.cooldown;
  },

  /**
   * Absorption + riposte. Appelé par Match avant que les PV ne bougent.
   * @returns {number} dégâts restants après absorption
   */
  onDamage(f, amount, source, opts, game) {
    f.state.regenDelay = f.el.ability.shield.regenDelay;
    if (f.shield <= 0 || amount <= 0) return amount;

    const absorbed = Math.min(f.shield, amount);
    f.shield -= absorbed;

    game.fx.ring(f.x, f.y, f.radius, f.radius * 1.5, 0.25, 'rgba(255,255,255,0.85)', 5, true);

    // riposte : c'est la stat « Shield Damage »
    const shield = f.el.ability.shield;
    if (
      source &&
      source !== f &&
      source.alive &&
      opts.kind !== 'reflect' &&
      f.state.reflectCd <= 0
    ) {
      f.state.reflectCd = shield.reflectCooldown;
      game.damage(source, shield.reflect(f), f, { kind: 'reflect', x: source.x, y: source.y });
    }
    return amount - absorbed;
  },

  castSnare(f, game) {
    const ult = f.el.ultimate;
    f.ult.active = ult.duration;
    f.ult.ready = false;
    f.state.snareTick = 0;
    game.fx.ring(f.x, f.y, 20, 240, 0.5, 'rgba(250,220,60,0.9)', 8, true);
    game.shake(5, 0.3);
  },

  tickSnare(f, dt, now, game) {
    const s = f.el.ultimate.snare;
    const target = f.opponent;
    if (!target || !target.alive) return;

    target.applySlow(s.slow, 0.2, now);
    target.applyTint(s.tint, 0.2, now);

    // le trait tire la cible vers la Lumière
    const dx = f.x - target.x;
    const dy = f.y - target.y;
    target.push(dx, dy, s.pull * dt * 60);

    f.state.snareTick -= dt;
    if (f.state.snareTick <= 0) {
      f.state.snareTick = s.tickInterval;
      game.damage(target, s.tickDamage, f, { kind: 'snare', silent: true });
      game.fx.burst(target.x, target.y, 4, { color: '#facc15', speed: 120, size: 4, life: 0.3 });
    }
  },

  drawUnder() {},

  /** Double trait doré, dessiné au-dessus des combattants. */
  drawOver(ctx, f, game, now) {
    if (f.ult.active <= 0) return;
    const s = f.el.ultimate.snare;
    const target = f.opponent;
    if (!target || !target.alive) return;

    const dx = target.x - f.x;
    const dy = target.y - f.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const pulse = 0.85 + 0.15 * Math.sin(now * 12);

    ctx.save();
    ctx.lineCap = 'butt';
    // halo
    ctx.strokeStyle = s.glow;
    ctx.lineWidth = (s.width + s.gap) * 2.1 * pulse;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    // deux rails dorés
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width * 0.5;
    for (const side of [-1, 1]) {
      const ox = nx * s.gap * side;
      const oy = ny * s.gap * side;
      ctx.beginPath();
      ctx.moveTo(f.x + ox, f.y + oy);
      ctx.lineTo(target.x + ox, target.y + oy);
      ctx.stroke();
    }
    ctx.restore();
  },

  barValue(f) {
    if (f.ult.active > 0) return f.ult.active / f.el.ultimate.duration;
    return f.ult.charge / 100;
  },
};
