/**
 * ============================================================================
 *  FICHES D'ÉLÉMENTS — source de vérité unique
 * ============================================================================
 *
 *  Tout ce qui définit un combattant est ici : apparence, vitesse, arme,
 *  pouvoir, ultime, projectiles, HUD. Le moteur ne contient AUCUNE constante
 *  propre à un élément : il lit cette fiche.
 *
 *  Les objets sont gelés (deepFreeze) : un duel ne peut pas les modifier, donc
 *  Ombre se comporte exactement pareil au 1er et au 100e duel. Le runtime
 *  travaille sur une copie d'état (voir game/fighter.js).
 *
 *  Ajouter un élément = ajouter une entrée ici + éventuellement un module de
 *  pouvoirs dans game/abilities/. Rien d'autre à toucher.
 *
 *  Unités : px (référentiel 720x1280 de la vidéo), secondes, radians.
 *  « mesuré » = valeur relevée sur la vidéo de référence.
 *  « calé »   = valeur ajustée pour retrouver le rythme observé (~60 s de duel).
 *
 * @module data/elements
 */

import { deepFreeze } from './freeze.js';

/** Vitesse de rotation d'arme commune : 330 °/s ≈ 5,76 rad/s (mesurée). */
const SPIN = 5.76;

/* ==========================================================================
 *  OMBRE  (DARK)
 * ========================================================================== */
const SHADOW = {
  id: 'shadow',
  name: 'OMBRE',
  nameRef: 'DARK', // libellé de la vidéo de référence
  tagline: 'Assassin — se déplace par pas d’ombre et draine l’essence',
  icon: 'orbDark',

  /* ---------- APPARENCE ---------- */
  look: {
    radius: 41, // mesuré : boule de 83 px de diamètre, contour compris
    body: '#870286', // pipette : rgb(132,6,132)
    bodyHit: '#ffffff', // flash blanc à l'encaissement (observé)
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12, // décalage de la ligne de base pour centrer les chiffres
    aura: {
      color: 'rgba(124,58,237,0.42)',
      radius: 1.62, // × rayon du corps
      pulse: 2.4, // Hz
      showWhen: 'ability-ready', // halo violet quand le Pas d’ombre est prêt
    },
    trail: {
      color: 'rgba(88,28,135,0.22)',
      every: 0.045, // s entre deux images fantômes
      life: 0.28,
    },
    accent: '#a855f7',
  },

  /* ---------- DÉPLACEMENT ---------- */
  movement: {
    speed: 440, // px/s (mesuré : 400→500 px/s hors ralentissement)
    turnRate: 1.75, // rad/s — pilotage vers l'adversaire (mesuré ~1,9)
    /** Poids du pilotage : 1 = fonce sur l'adversaire, 0 = billard pur.
     *  Calé pour retrouver le rythme de la vidéo : ~13 touches d'arme par
     *  combattant sur un duel d'une minute. */
    seek: 0.42,
    mass: 1,
  },

  /* ---------- ARME ---------- */
  weapon: {
    name: 'Lame du Néant',
    reach: 77, // mesuré : centre → pointe = 77 px
    spin: SPIN,
    spinDir: -1, // sens initial (s'inverse aux rebonds)
    handle: {
      length: 17, // partie manche, en grande partie masquée par le corps
      width: 11,
      color: '#2b2130',
      dark: '#171021',
      outline: '#0b0710',
      gem: null,
    },
    head: { sprite: 'darkBlade', scale: 3.0, anchorY: 0.5 },
    /** Portion tranchante (fraction de la portée) + demi-épaisseur. */
    hitbox: { from: 0.42, to: 1, radius: 13 },
    melee: {
      damage: 4, // calé : chutes de PV observées de ~4-5 côté Glace
      cooldown: 1.3, // s entre deux touches de la même arme
      knockback: 300,
      selfRecoil: 90,
    },
  },

  /* ---------- POUVOIR (touche active, automatique) ---------- */
  ability: {
    id: 'shadowStep',
    name: 'Pas d’ombre',
    nameRef: 'Shadow Step',
    /** Cooldown initial affiché « Shadow Step Cooldown: 3s » (mesuré). */
    cooldown: 3,
    /** Chaque utilisation raccourcit le cooldown (3 → 2,8 → 2,6 … mesuré). */
    cooldownStep: 0.2,
    cooldownFloor: 0.7, // plancher observé en fin de duel
    /** Téléportation courte dans la direction de course. */
    blink: {
      distance: 190,
      ghosts: 7, // images fantômes laissées derrière
      invulnerable: 0.12,
      speedBoost: 1.35, // pendant 0,45 s après le saut
      boostDuration: 0.45,
    },
    /** Volée tirée à l'arrivée (3 traits observés dans la vidéo). */
    volley: { count: 3, spread: 0.38, projectile: 'shadowBolt' },
  },

  /* ---------- ULTIME (jauge du HUD) ---------- */
  ultimate: {
    id: 'essenceTether',
    name: 'Lien d’essence',
    nameRef: 'ESSENCE TETHER',
    barLabel: 'ESSENCE TETHER',
    barLabelFr: 'LIEN D’ESSENCE',
    barFill: '#870286',
    barText: '#f3e8ff',
    /** Charge : +chargeRate/s et +chargeOnHit par touche portée. */
    chargeRate: 3.4, // calé : ~2 incantations sur un duel d'une minute
    chargeOnHit: 2,
    duration: 6.5, // mesuré : dôme actif ~6 s
    dome: {
      radius: 270, // mesuré : ~270 px de rayon
      fill: 'rgba(30,24,45,0.88)', // pipette : rgb(52,46,70) sur blanc
      edge: 'rgba(76,29,149,0.95)',
      edgeWidth: 4,
      sparks: 120, // poussière violette qui dérive dans le dôme
      sparkColors: ['#a855f7', '#c4b5fd', '#ffffff', '#6d28d9'],
      /** Le dôme est figé à l'endroit de l'incantation. */
      anchored: true,
    },
    tether: {
      color: '#7c3aed',
      core: 'rgba(255,255,255,0.55)',
      width: 5,
      tickInterval: 0.28, // mesuré : ~1 PV toutes les 0,3 s
      tickDamage: 1,
      slow: 0.15, // ralentit la cible tant que le lien tient
      motes: 26, // particules qui remontent le lien vers l'Ombre
    },
  },

  /* ---------- PROJECTILES ---------- */
  projectiles: {
    shadowBolt: {
      label: 'Trait d’ombre',
      sprite: 'darkBlade', // mini version de la lame (observé)
      scale: 2.2, // mesuré : trait d'ombre d'environ 44 px de long
      speed: 600,
      damage: 2,
      radius: 11,
      life: 1.5,
      bounces: 0,
      knockback: 70,
      trail: { color: 'rgba(59,35,80,0.35)', every: 0.05, life: 0.22 },
    },
  },

  /* ---------- LIGNE DE STAT DU HUD ---------- */
  hud: {
    /** @param {import('../game/fighter.js').Fighter} f */
    stat: (f) => `Shadow Step Cooldown: ${formatSeconds(f.ability.cooldown)}`,
    statFr: (f) => `Pas d’ombre — recharge : ${formatSeconds(f.ability.cooldown)}`,
    color: '#870286',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  GLACE  (ICE)
 * ========================================================================== */
const ICE = {
  id: 'ice',
  name: 'GLACE',
  nameRef: 'ICE',
  tagline: 'Contrôle — empile les stacks de dégâts/ralentissement',
  icon: 'snowflake',

  look: {
    radius: 41,
    body: '#00eff0', // pipette : rgb(0,239,240)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(34,211,238,0.42)',
      radius: 1.62,
      pulse: 2.0,
      showWhen: 'ultimate-ready', // halo cyan quand le Blizzard est chargé
    },
    trail: { color: 'rgba(125,211,252,0.28)', every: 0.05, life: 0.26 },
    accent: '#06b6d4',
  },

  movement: {
    speed: 470, // mesuré : médiane ~470 px/s hors ralentissement
    turnRate: 1.9,
    seek: 0.42,
    mass: 1,
  },

  weapon: {
    name: 'Hache de givre',
    reach: 132, // mesuré : centre → pointe de hache = 132 px
    spin: SPIN,
    spinDir: 1,
    handle: {
      length: 90, // long manche gris (mesuré : 90 px + 42 px de tête = 132)
      width: 11,
      color: '#7d838c',
      dark: '#3f444b',
      outline: '#0d0d12',
      gem: { at: 0.52, size: 8, color: '#37d7f0' }, // pierre cyan au milieu
    },
    head: { sprite: 'iceAxeHead', scale: 3.5, anchorY: 0.5 },
    hitbox: { from: 0.62, to: 1, radius: 20 }, // seule la tête tranche
    melee: {
      /**
       * Dégâts = nombre de stacks affiché « Damage/Slow: N » (mesuré : la
       * valeur démarre à 1 et monte de 1 à chaque touche portée).
       * @param {import('../game/fighter.js').Fighter} self
       */
      damage: (self) => self.stacks,
      cooldown: 1,
      knockback: 260,
      selfRecoil: 80,
      /** Chaque touche empile un ralentissement sur la cible. */
      onHit: { stackGain: 1, slowPerStack: 0.03, slowMax: 0.45, slowDuration: 2.6 },
    },
  },

  /** Pouvoir passif : salve d'éclats radiale à intervalle fixe. */
  ability: {
    id: 'frostShards',
    name: 'Éclats de givre',
    nameRef: 'Frost Shards',
    cooldown: 5, // s entre deux salves hors Blizzard
    cooldownStep: 0, // pas d'accélération : c'est la stat « Damage/Slow » qui monte
    cooldownFloor: 5,
    burst: { count: 6, spread: Math.PI * 2, projectile: 'iceShard' },
    /** Pendant le Blizzard, salves plus rapides et plus fournies (observé). */
    duringUltimate: { cooldown: 1.2, count: 10 },
  },

  ultimate: {
    id: 'blizzard',
    name: 'Blizzard',
    nameRef: 'BLIZZARD',
    barLabel: 'BLIZZARD',
    barLabelFr: 'BLIZZARD',
    barFill: '#00eff0',
    barText: '#083344',
    barAnchor: 'right', // la jauge se remplit depuis la droite (observé)
    chargeRate: 5.4, // calé : Blizzard toutes les ~18 s comme dans la vidéo
    chargeOnHit: 2,
    duration: 5.2,
    shockwave: {
      // onde cyan qui dépasse largement l'arène au déclenchement (observé)
      from: 40,
      to: 900,
      time: 0.95,
      color: 'rgba(103,214,236,0.85)',
      width: 6,
    },
    field: {
      radius: 130, // mesuré : disque cyan de ~130 px autour de la Glace
      fill: 'rgba(224,247,255,0.55)',
      edge: 'rgba(103,214,236,0.75)',
      edgeWidth: 3,
      follows: true, // le champ suit la Glace
      slow: 0.35,
      tickInterval: 0.7,
      tickDamage: 1,
    },
    snow: { count: 90, fall: 46, drift: 22, color: 'rgba(186,230,253,0.9)' },
  },

  projectiles: {
    iceShard: {
      label: 'Éclat de givre',
      sprite: 'iceShard',
      scale: 2.4,
      speed: 380,
      damage: 1,
      radius: 10,
      life: 3.4,
      bounces: 2, // les éclats ricochent sur les murs (observé)
      knockback: 45,
      onHit: { slow: 0.12, slowDuration: 1.6 },
      trail: { color: 'rgba(186,230,253,0.55)', every: 0.035, life: 0.5, dotted: true },
    },
  },

  hud: {
    stat: (f) => `Damage/Slow: ${f.stacks}`,
    statFr: (f) => `Dégâts/Ralent. : ${f.stacks}`,
    color: '#00d5e6',
    stroke: '#0a0a0a',
  },
};

/** Formatage « 3s » / « 2.4s » identique à la vidéo. */
function formatSeconds(v) {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? `${r}s` : `${r.toFixed(1)}s`;
}

export const ELEMENTS = deepFreeze({ shadow: SHADOW, ice: ICE });

/** Ordre d'affichage dans l'écran de sélection. */
export const ROSTER = deepFreeze(['shadow', 'ice']);

/** @param {string} id */
export function getElement(id) {
  const el = ELEMENTS[id];
  if (!el) throw new Error(`Élément inconnu : ${id}`);
  return el;
}
