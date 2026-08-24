/**
 * Couche de **mise en scène** : tout ce qui rend le duel spectaculaire sans
 * rien changer à ce qui se passe.
 *
 * Ruban d'arme, poussière d'ambiance, nombres de dégâts qui montent, éclat
 * d'incantation, état critique : aucun de ces effets ne touche aux PV, aux
 * positions ni aux minuteurs. C'est ce qui autorise sa règle de fonctionnement
 * la plus importante :
 *
 * > **La mise en scène a son propre aléa** (`viewRng`), jamais celui de la
 * > simulation. Un `game.rng.next()` de plus dans un chemin de rendu décalerait
 * > tout le flux et changerait les vainqueurs — c'est arrivé deux fois.
 *
 * Elle a aussi son propre banc de particules : la nuée décorative ne peut donc
 * pas évincer les particules de jeu du pool partagé.
 *
 * @module render/flair
 */

import { ARENA } from '../data/tuning.js';
import { TAU } from '../core/math.js';

const MAX_MOTES = 260;
const MAX_POPS = 24;
/** Longueur du ruban d'arme, en pas de simulation (120 Hz). */
const RIBBON = 26;

export class Flair {
  /** @param {{range:Function, spread:Function, pick:Function, chance:Function}} rng viewRng */
  constructor(rng) {
    this.rng = rng;
    /** @type {Array<any>} */
    this.motes = [];
    for (let i = 0; i < MAX_MOTES; i++) this.motes.push({ alive: false });
    this.moteCursor = 0;
    /** @type {Array<any>} */
    this.pops = [];
    for (let i = 0; i < MAX_POPS; i++) this.pops.push({ alive: false });
    this.popCursor = 0;
    /** @type {Map<any, {pts:number[], head:number, n:number}>} */
    this.ribbons = new Map();
    /** Éclair blanc plein cadre, très bref (incantation d'ultime, K.O.). */
    this.flash = 0;
    this.flashMax = 1;
    this.flashColor = 'rgba(255,255,255,0.55)';
    this.moteDebt = new Map();
    this.ambientDebt = 0;
  }

  attach(fighters) {
    for (const f of fighters) {
      this.ribbons.set(f, { pts: new Float32Array(RIBBON * 2), head: 0, n: 0 });
      this.moteDebt.set(f, 0);
    }
  }

  _mote(props) {
    for (let i = 0; i < MAX_MOTES; i++) {
      const idx = (this.moteCursor + i) % MAX_MOTES;
      if (!this.motes[idx].alive) {
        this.moteCursor = (idx + 1) % MAX_MOTES;
        return Object.assign(this.motes[idx], {
          alive: true, x: 0, y: 0, vx: 0, vy: 0, life: 1, maxLife: 1,
          size: 4, color: '#fff', drag: 1.4, gravity: 0, shape: 'dot', spin: 0, angle: 0,
        }, props);
      }
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Événements                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Une touche : le nombre de dégâts s'envole et une gerbe part à la couleur
   * de l'attaquant.
   */
  hit(x, y, amount, source, target) {
    const flair = source?.el?.look?.flair;
    const accent = source?.el?.look?.accent ?? '#ffffff';
    const pop = this.pops[this.popCursor];
    this.popCursor = (this.popCursor + 1) % MAX_POPS;
    Object.assign(pop, {
      alive: true,
      // décalé au-dessus et sur le côté : le nombre ne doit jamais recouvrir
      // les PV inscrits dans la boule
      x: x + this.rng.spread(18),
      y: y - 52,
      vy: -70,
      life: 1,
      maxLife: 1,
      text: String(amount),
      color: accent,
      big: amount >= 8,
    });

    const colors = flair?.impact ?? [accent, '#ffffff'];
    const n = 6 + Math.min(10, amount);
    for (let i = 0; i < n; i++) {
      const a = this.rng.range(0, TAU);
      const v = this.rng.range(90, 340);
      this._mote({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: this.rng.range(0.25, 0.6),
        size: this.rng.range(3, 8),
        color: this.rng.pick(colors),
        shape: flair?.shape ?? 'spark',
        drag: 3.2,
        spin: this.rng.spread(14),
      });
    }
    // onde de choc au point d'impact, aux couleurs de la victime
    this._mote({
      x, y, life: 0.28, maxLife: 0.28, size: 12 + amount * 2.2,
      color: target?.el?.look?.body ?? accent, shape: 'shock', drag: 0, vx: 0, vy: 0,
    });
    // et une marque au sol qui s'efface : le combat laisse une trace
    this._mote({
      x, y, life: 1.3, maxLife: 1.3, size: 10 + amount * 1.6,
      color: accent, shape: 'scar', drag: 0, vx: 0, vy: 0,
    });
  }

  /** Incantation d'ultime : éclat plein cadre + couronne de traits. */
  cast(f, color) {
    this.flash = 0.16;
    this.flashMax = 0.16;
    this.flashColor = color ?? 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 22; i++) {
      const a = (TAU * i) / 22 + this.rng.spread(0.1);
      this._mote({
        x: f.x + Math.cos(a) * f.radius,
        y: f.y + Math.sin(a) * f.radius,
        vx: Math.cos(a) * 420,
        vy: Math.sin(a) * 420,
        life: this.rng.range(0.3, 0.55),
        size: this.rng.range(5, 11),
        color: this.rng.pick([f.el.look.body, f.el.look.accent, '#ffffff']),
        shape: 'streak',
        drag: 3,
        angle: a,
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Pas fixe                                                            */
  /* ------------------------------------------------------------------ */

  update(dt, fighters, live) {
    this.flash = Math.max(0, this.flash - dt);

    for (const f of fighters) {
      if (!f.alive) continue;
      this._trackRibbon(f);
      if (live) this._emitMotes(f, dt);
    }
    if (live) this._ambient(dt, fighters);

    const inner = ARENA.inner;
    for (const m of this.motes) {
      if (!m.alive) continue;
      m.life -= dt;
      if (m.life <= 0) { m.alive = false; continue; }
      if (m.drag) {
        const k = Math.exp(-m.drag * dt);
        m.vx *= k; m.vy *= k;
      }
      if (m.gravity) m.vy += m.gravity * dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.spin) m.angle += m.spin * dt;
      if (m.x < inner.left - 40 || m.x > inner.right + 40) m.alive = false;
    }

    for (const p of this.pops) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.y += p.vy * dt;
      p.vy *= Math.exp(-2.6 * dt);
    }
  }

  /**
   * Poussière d'arène : une dérive lente aux couleurs des deux combattants sur
   * toute la surface. C'est ce qui empêche le cadre d'être vide entre deux
   * échanges — volontairement petite et diluée pour ne jamais brouiller la
   * lecture du duel.
   */
  _ambient(dt, fighters) {
    this.ambientDebt = (this.ambientDebt ?? 0) + dt * 7;
    while (this.ambientDebt >= 1) {
      this.ambientDebt -= 1;
      const f = fighters[this.rng.next() < 0.5 ? 0 : 1];
      const spec = f?.el?.look?.flair?.motes;
      if (!spec) continue;
      const i = ARENA.inner;
      this._mote({
        x: this.rng.range(i.left, i.right),
        y: this.rng.range(i.top, i.bottom),
        vx: this.rng.spread(16),
        vy: -this.rng.range(4, 22),
        life: this.rng.range(1.6, 3),
        size: this.rng.range(3, 6),
        color: this.rng.pick(spec.colors),
        shape: 'dust',
        drag: 0.25,
        spin: this.rng.spread(4),
      });
    }
  }

  /** Mémorise la pointe de l'arme pour en faire un ruban. */
  _trackRibbon(f) {
    const r = this.ribbons.get(f);
    if (!r) return;
    const reach = f.el.weapon.reach;
    r.pts[r.head * 2] = f.x + Math.cos(f.weaponAngle) * reach;
    r.pts[r.head * 2 + 1] = f.y + Math.sin(f.weaponAngle) * reach;
    r.head = (r.head + 1) % RIBBON;
    if (r.n < RIBBON) r.n++;
  }

  /** Poussière d'ambiance : le combattant n'est jamais inerte. */
  _emitMotes(f, dt) {
    const spec = f.el.look.flair?.motes;
    if (!spec) return;

    // **Annonce d'ultime** : passé 85 % de jauge, la matière converge vers lui.
    // C'est l'effet qui fait attendre la suite au lieu de la subir.
    if (f.ult.charge >= 85 && !f.ult.active) {
      const heat = (f.ult.charge - 85) / 15;
      if (this.rng.chance(dt * (16 + 42 * heat))) {
        const a = this.rng.range(0, TAU);
        const d = f.radius * this.rng.range(2.6, 4.4);
        this._mote({
          x: f.x + Math.cos(a) * d,
          y: f.y + Math.sin(a) * d,
          vx: -Math.cos(a) * d * 2.4,
          vy: -Math.sin(a) * d * 2.4,
          life: 0.42,
          size: this.rng.range(5, 10),
          color: this.rng.pick(spec.colors),
          shape: 'streak',
          drag: 0.4,
          angle: a,
        });
      }
    }
    // sous 25 PV, le combattant « fuit » deux fois plus de matière
    const hurt = f.hp <= 25 ? 2 : 1;
    let debt = this.moteDebt.get(f) + dt * spec.rate * hurt;
    while (debt >= 1) {
      debt -= 1;
      const a = this.rng.range(0, TAU);
      const rad = f.radius * this.rng.range(0.6, 1.25);
      this._mote({
        x: f.x + Math.cos(a) * rad,
        y: f.y + Math.sin(a) * rad,
        vx: this.rng.spread(spec.drift) - f.impulseX * 0.04,
        vy: this.rng.spread(spec.drift) + (spec.rise ?? 0),
        life: this.rng.range(0.4, 1.1),
        size: this.rng.range(spec.size * 0.5, spec.size),
        color: this.rng.pick(spec.colors),
        shape: f.el.look.flair.shape ?? 'dot',
        drag: 1.1,
        spin: this.rng.spread(9),
      });
    }
    this.moteDebt.set(f, debt);
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  /** Rubans d'arme + poussière : sous les combattants. */
  drawUnder(ctx, fighters) {
    for (const f of fighters) {
      if (f.alive) this._drawRibbon(ctx, f);
    }
    for (const m of this.motes) {
      if (!m.alive) continue;
      const t = m.life / m.maxLife;
      ctx.globalAlpha = Math.max(0, Math.min(1, t * 1.3));
      ctx.fillStyle = m.color;
      switch (m.shape) {
        case 'scar': {
          ctx.globalAlpha = t * t * 0.22;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * (1.9 - t * 0.9), 0, TAU);
          ctx.fill();
          break;
        }
        case 'shock': {
          ctx.globalAlpha = t * 0.8;
          ctx.strokeStyle = m.color;
          ctx.lineWidth = 4 * t + 1;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * (1.6 - t), 0, TAU);
          ctx.stroke();
          break;
        }
        case 'streak': {
          const len = m.size * 3.4 * t;
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(m.angle);
          ctx.fillRect(-len / 2, -m.size * 0.28, len, m.size * 0.56);
          ctx.restore();
          break;
        }
        case 'spark': {
          const s = m.size * (0.5 + 0.5 * t);
          ctx.save();
          ctx.translate(m.x, m.y);
          ctx.rotate(m.angle);
          ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.restore();
          break;
        }
        case 'dust': {
          // très diluée, et elle apparaît/disparaît en fondu
          ctx.globalAlpha = 0.3 * Math.sin(Math.PI * (1 - t));
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size, 0, TAU);
          ctx.fill();
          break;
        }
        default: {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * (0.45 + 0.55 * t), 0, TAU);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  _drawRibbon(ctx, f) {
    const r = this.ribbons.get(f);
    const spec = f.el.look.flair?.ribbon;
    if (!r || r.n < 3 || !spec) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // du plus ancien au plus récent : le trait s'épaissit et s'opacifie
    for (let i = 1; i < r.n; i++) {
      const a = (r.head - r.n + i - 1 + RIBBON * 2) % RIBBON;
      const b = (r.head - r.n + i + RIBBON * 2) % RIBBON;
      const k = i / r.n;
      ctx.globalAlpha = spec.alpha * k * k;
      ctx.strokeStyle = spec.color;
      ctx.lineWidth = spec.width * k;
      ctx.beginPath();
      ctx.moveTo(r.pts[a * 2], r.pts[a * 2 + 1]);
      ctx.lineTo(r.pts[b * 2], r.pts[b * 2 + 1]);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  /** État critique : au-dessus des combattants, sous les nombres. */
  drawDanger(ctx, fighters, now) {
    for (const f of fighters) {
      if (!f.alive || f.hp > 25) continue;
      const urgency = 1 - f.hp / 25;
      const beat = 0.5 + 0.5 * Math.sin(now * (7 + urgency * 9));
      ctx.save();
      ctx.globalAlpha = (0.28 + 0.42 * urgency) * beat;
      ctx.strokeStyle = '#ff2d2d';
      ctx.lineWidth = 3 + 4 * urgency;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius + 9 + 4 * beat, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  /** Nombres de dégâts : toujours au-dessus de tout. */
  drawPops(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    for (const p of this.pops) {
      if (!p.alive) continue;
      const t = p.life / p.maxLife;
      const size = (p.big ? 44 : 34) * (1.25 - 0.25 * t);
      ctx.globalAlpha = Math.min(1, t * 2.2);
      ctx.font = `900 ${size}px "Archivo Black", "Arial Black", sans-serif`;
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#0a0a0a';
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  /** Éclat plein cadre, hors arène compris. */
  drawFlash(ctx) {
    if (this.flash <= 0) return;
    ctx.save();
    ctx.globalAlpha = (this.flash / this.flashMax) * 0.9;
    ctx.fillStyle = this.flashColor;
    const i = ARENA.inner;
    ctx.fillRect(i.left, i.top, i.right - i.left, i.bottom - i.top);
    ctx.restore();
  }

  clear() {
    for (const m of this.motes) m.alive = false;
    for (const p of this.pops) p.alive = false;
    for (const r of this.ribbons.values()) r.n = 0;
    this.flash = 0;
  }
}
