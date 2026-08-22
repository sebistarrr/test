/**
 * Déroulement d'un duel : machine à états, mise à jour et rendu.
 *
 * Phases : intro → fight → ko → over
 *
 * @module game/match
 */

import { ARENA, MATCH, PHYSICS } from '../data/tuning.js';
import { assertFrozen } from '../data/freeze.js';
import { getElement } from '../data/elements.js';
import { Fighter } from './fighter.js';
import { Projectiles } from './projectiles.js';
import { abilitiesFor } from './abilities/index.js';
import { resolveBodies, weaponHit } from './physics.js';
import { Effects } from '../render/effects.js';
import { createRng } from '../core/rng.js';
import { buildBackdrop, drawBackdrop } from '../render/scene.js';
import { drawFighterHud } from '../render/hud.js';

export class Match {
  /**
   * @param {{elements:[string,string], rng:object, lang:'ref'|'fr', debug?:boolean,
   *          onEnd:(result:object)=>void}} opts
   */
  constructor({ elements, rng, lang = 'ref', debug = false, onEnd }) {
    const [idA, idB] = elements;
    const elA = getElement(idA);
    const elB = getElement(idB);
    assertFrozen(elA, elA.id);
    assertFrozen(elB, elB.id);

    this.rng = rng;
    // Aléa réservé au rendu (tremblement de caméra) : il ne doit jamais
    // consommer le flux de la simulation, sinon deux exécutions d'un même
    // seed divergeraient selon le nombre d'images affichées.
    this.viewRng = createRng((rng.seed ?? 1) ^ 0x9e3779b9);
    this.lang = lang;
    this.debug = debug;
    this.onEnd = onEnd;

    this.fx = new Effects(rng);
    this.projectiles = new Projectiles(this.fx);

    this.a = new Fighter(elA, 0, rng);
    this.b = new Fighter(elB, 1, rng);
    this.a.opponent = this.b;
    this.b.opponent = this.a;
    this.fighters = [this.a, this.b];

    this.modules = new Map([
      [this.a, abilitiesFor(elA.id)],
      [this.b, abilitiesFor(elB.id)],
    ]);
    for (const [f, mod] of this.modules) mod.init(f, this);

    this.backdrop = buildBackdrop({ a: elA, b: elB, lang });

    this.phase = 'intro';
    this.time = 0;
    this.phaseTime = 0;
    this.shakeMag = 0;
    this.shakeTime = 0;
    this.stats = { hits: [0, 0], damage: [0, 0], duration: 0 };
    /** @type {Fighter|null} */
    this.winner = null;
  }

  shake(mag, time) {
    this.shakeMag = Math.max(this.shakeMag, mag);
    this.shakeTime = Math.max(this.shakeTime, time);
  }

  /* ------------------------------------------------------------------ */
  /* Simulation                                                          */
  /* ------------------------------------------------------------------ */

  update(dtRaw) {
    const dt = this.phase === 'ko' ? dtRaw * MATCH.koSlowmo : dtRaw;
    this.time += dt;
    this.phaseTime += dtRaw;

    if (this.shakeTime > 0) {
      this.shakeTime -= dtRaw;
      if (this.shakeTime <= 0) this.shakeMag = 0;
    }

    switch (this.phase) {
      case 'intro':
        if (this.phaseTime >= MATCH.introDuration) this.setPhase('fight');
        break;
      case 'ko':
        if (this.phaseTime >= MATCH.koDuration) {
          this.setPhase('over');
          this.onEnd?.(this.result());
        }
        break;
      default:
        break;
    }

    // combattants
    for (const f of this.fighters) {
      if (this.phase === 'ko' && !f.alive) continue;
      f.step(dt, this.time);
    }

    // corps à corps + collisions
    if (this.phase === 'fight') {
      resolveBodies(this.a, this.b);
      this.resolveMelee(this.a, this.b);
      this.resolveMelee(this.b, this.a);
    }

    // pouvoirs
    for (const [f, mod] of this.modules) {
      if (!f.alive) continue;
      mod.update(f, dt, this.time, this);
    }

    this.projectiles.update(dt, this.time, this.fighters, (target, amount, source, opts) =>
      this.damage(target, amount, source, opts),
    );
    this.fx.update(dt);

    if (this.phase === 'fight') this.stats.duration = this.time;
  }

  setPhase(next) {
    this.phase = next;
    this.phaseTime = 0;
  }

  /** @param {Fighter} attacker @param {Fighter} target */
  resolveMelee(attacker, target) {
    const hit = weaponHit(attacker, target);
    if (!hit) return;

    const melee = attacker.el.weapon.melee;
    const dmg = typeof melee.damage === 'function' ? melee.damage(attacker) : melee.damage;

    attacker.meleeCd = melee.cooldown;
    this.damage(target, dmg, attacker, {
      kind: 'melee',
      x: hit.x,
      y: hit.y,
      nx: hit.nx,
      ny: hit.ny,
      knockback: melee.knockback,
    });

    // recul de l'attaquant (il repart en arrière, observé sur la vidéo)
    attacker.push(-hit.nx, -hit.ny, melee.selfRecoil);

    // effets à la touche décrits dans la fiche (piles de la Glace, etc.)
    if (melee.onHit) {
      if (melee.onHit.stackGain) attacker.stacks += melee.onHit.stackGain;
      if (melee.onHit.slowPerStack) {
        const slow = Math.min(melee.onHit.slowMax, attacker.stacks * melee.onHit.slowPerStack);
        target.applySlow(slow, melee.onHit.slowDuration, this.time);
      }
    }
  }

  /**
   * Point d'entrée unique des dégâts : PV, flash, recul, particules, charge
   * d'ultime, détection du K.O.
   */
  damage(target, amount, source, opts = {}) {
    if (!target.alive || this.phase === 'over') return;
    if (target.invulnerable > 0 && opts.kind !== 'tether') return;

    const amt = Math.max(0, Math.round(amount));
    target.hp = Math.max(0, target.hp - amt);
    target.flash = PHYSICS.hitFlash;

    const idx = source === this.a ? 0 : 1;
    this.stats.damage[idx] += amt;
    if (opts.kind === 'melee' || opts.kind === 'projectile') this.stats.hits[idx]++;

    if (opts.knockback) target.push(opts.nx ?? 0, opts.ny ?? 0, opts.knockback);

    // charge d'ultime gagnée par l'attaquant
    if (!opts.silent && source?.el?.ultimate) {
      source.ult.charge = Math.min(100, source.ult.charge + (source.el.ultimate.chargeOnHit ?? 0));
    }

    // gerbe d'étincelles aux couleurs de l'attaquant
    if (!opts.silent) {
      const x = opts.x ?? target.x;
      const y = opts.y ?? target.y;
      this.fx.burst(x, y, opts.kind === 'melee' ? 14 : 8, {
        color: [source.el.look.accent, '#ffffff', target.el.look.body],
        speed: opts.kind === 'melee' ? 300 : 180,
        size: 5,
        life: 0.4,
      });
      this.shake(opts.kind === 'melee' ? 4 : 2, 0.18);
    }

    if (target.hp <= 0) this.knockout(target, source);
  }

  knockout(loser, winner) {
    if (this.phase === 'ko' || this.phase === 'over') return;
    this.winner = winner ?? (loser === this.a ? this.b : this.a);
    this.setPhase('ko');
    this.fx.burst(loser.x, loser.y, 60, {
      color: [loser.el.look.body, '#ffffff', loser.el.look.accent],
      speed: 520,
      size: 7,
      life: 1.1,
    });
    this.fx.ring(loser.x, loser.y, 10, 260, 0.7, loser.el.look.body, 10, true);
    this.shake(12, 0.6);
  }

  result() {
    const winner = this.winner ?? this.a;
    const loser = winner === this.a ? this.b : this.a;
    return {
      winner: winner.el,
      loser: loser.el,
      winnerHp: Math.max(0, Math.ceil(winner.hp)),
      duration: this.stats.duration,
      hits: this.stats.hits,
      damage: this.stats.damage,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    // 1. décor statique (jamais modifié)
    drawBackdrop(ctx, this.backdrop);

    // 2. contenu de l'arène (seul élément soumis au tremblement)
    ctx.save();
    if (this.shakeMag > 0) {
      const k = this.shakeTime > 0 ? this.shakeMag : 0;
      ctx.translate(this.viewRng.spread(k), this.viewRng.spread(k));
    }

    const inner = ARENA.inner;
    ctx.save();
    ctx.beginPath();
    ctx.rect(inner.left, inner.top, inner.right - inner.left, inner.bottom - inner.top);
    ctx.clip();

    for (const [f, mod] of this.modules) mod.drawUnder(ctx, f, this, this.time);
    this.fx.draw(ctx, true);
    this.projectiles.draw(ctx);
    for (const f of this.fighters) {
      if (f.alive || this.phase !== 'over') f.draw(ctx, this.time);
    }
    for (const [f, mod] of this.modules) mod.drawOver(ctx, f, this, this.time);
    if (this.debug) {
      for (const f of this.fighters) f.drawDebug(ctx);
      this.projectiles.drawDebug(ctx);
    }
    ctx.restore();

    // effets non clippés (onde de choc du Blizzard qui déborde de l'arène)
    this.fx.draw(ctx, false);
    ctx.restore();

    // 3. HUD
    drawFighterHud(ctx, this.a, 'left', this.modules.get(this.a).barValue(this.a), this.lang);
    drawFighterHud(ctx, this.b, 'right', this.modules.get(this.b).barValue(this.b), this.lang);

    if (this.phase === 'intro') this.drawIntro(ctx);
    if (this.debug) this.drawDebugOverlay(ctx);
  }

  drawIntro(ctx) {
    const t = 1 - this.phaseTime / MATCH.introDuration;
    ctx.save();
    ctx.globalAlpha = Math.max(0, t);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    const i = ARENA.inner;
    ctx.fillRect(i.left, i.top, i.right - i.left, i.bottom - i.top);
    ctx.restore();
  }

  drawDebugOverlay(ctx) {
    ctx.save();
    ctx.font = '600 20px "Oswald", sans-serif';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const lines = [
      `phase ${this.phase}  t=${this.time.toFixed(1)}s  seed=${this.rng.seed}`,
      `A ${this.a.el.id} hp=${this.a.hp} spd=${Math.round(this.a.currentSpeed(this.time))} ult=${Math.round(this.a.ult.charge)}`,
      `B ${this.b.el.id} hp=${this.b.hp} spd=${Math.round(this.b.currentSpeed(this.time))} ult=${Math.round(this.b.ult.charge)}`,
      `projectiles ${this.projectiles.list.length}`,
    ];
    lines.forEach((l, i) => ctx.fillText(l, 12, 12 + i * 22));
    ctx.restore();
  }
}
