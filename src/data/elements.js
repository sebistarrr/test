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
      damage: 5, // calé : chutes de PV observées de ~4-5 côté Glace
      cooldown: 1.15, // s entre deux touches de la même arme
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
    chargeRate: 4.5, // calé : ~2 incantations sur un duel d'une minute
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
      damage: 3,
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
      onHit: {
        stackGain: 1,
        slowPerStack: 0.03,
        slowMax: 0.45,
        slowDuration: 2.6,
        /** Givre visible : la victime prend un voile bleuté (observé — sur
         *  le jaune de la Lumière, cela donne le vert pâle de la vidéo). */
        tint: { color: '#7fe3ff', alpha: 0.42, duration: 2.6 },
      },
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
    burst: { count: 7, spread: Math.PI * 2, projectile: 'iceShard' },
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
      damage: 2,
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

/* ==========================================================================
 *  FEU  (FIRE)
 *  Relevé : vidéos « LIGHT vs FIRE » et « FIRE vs WATER ».
 * ========================================================================== */
const FIRE = {
  id: 'fire',
  name: 'FEU',
  nameRef: 'FIRE',
  tagline: 'Attrition — marque l’adversaire d’une brûlure qui s’aggrave',
  icon: 'iconFlame',

  look: {
    radius: 41,
    body: '#fb0a0a', // pipette : rgb(254,0,0)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(249,115,22,0.45)',
      radius: 1.7,
      pulse: 3.2,
      showWhen: 'ultimate-ready',
    },
    trail: { color: 'rgba(249,115,22,0.28)', every: 0.05, life: 0.3 },
    accent: '#f2670c',
  },

  movement: { speed: 480, turnRate: 1.95, seek: 0.42, mass: 1 },

  weapon: {
    name: 'Lame ardente',
    reach: 150, // mesuré : ~166 px, ramené à l'échelle du roster
    spin: SPIN,
    spinDir: -1,
    handle: {
      length: 78,
      width: 12,
      color: '#3f2a20',
      dark: '#211410',
      outline: '#0a0502',
      gem: { at: 0.85, size: 9, color: '#dc2626' },
    },
    head: { sprite: 'fireBlade', scale: 4, anchorY: 0.5 },
    hitbox: { from: 0.5, to: 1, radius: 16 },
    melee: {
      damage: 5,
      cooldown: 1.15,
      knockback: 240,
      selfRecoil: 85,
      onHit: {
        // « Burn Damage/Duration » monte de 0,5 par touche (1 → 5,5 mesuré)
        stackGain: 0.5,
        stackMax: 12,
        dot: {
          damage: (self) => Math.max(1, Math.round(self.stacks / 2.4)),
          interval: 1,
          duration: (self) => self.stacks, // la stat sert aussi de durée
          ring: '#f97316', // cerclage orange sur la victime (observé)
        },
      },
    },
  },

  ability: {
    id: 'emberBurst',
    name: 'Gerbe de braises',
    nameRef: 'Ember Burst',
    cooldown: 3.6,
    cooldownStep: 0,
    cooldownFloor: 3.6,
    burst: { count: 3, spread: 0.55, projectile: 'ember' },
  },

  ultimate: {
    id: 'infernalRage',
    name: 'Rage infernale',
    nameRef: 'INFERNAL RAGE',
    barLabel: 'INFERNAL RAGE',
    barLabelFr: 'RAGE INFERNALE',
    barFill: '#dc2626',
    barText: '#fff1f0',
    chargeRate: 4.4,
    chargeOnHit: 3,
    duration: 6,
    /** Nova de cubes orange à l'incantation (observée image par image). */
    nova: { count: 90, speed: 460, size: 13, life: 1.1, colors: ['#f97316', '#ea580c', '#fbbf24', '#dc2626'] },
    /** Ailes de flammes autour du corps pendant toute la durée. */
    wings: { color: '#f97316', core: '#fbbf24', span: 2.3, flap: 6 },
    /** Aura brûlante : tout adversaire trop près prend la brûlure. */
    aura: { radius: 150, tickInterval: 0.6, tickDamage: 2 },
    speedBonus: 1.2,
  },

  projectiles: {
    ember: {
      label: 'Braise',
      sprite: 'ember',
      scale: 3,
      speed: 520,
      damage: 4,
      radius: 11,
      life: 1.3,
      bounces: 0,
      knockback: 90,
      onHit: { dot: { damage: 1, interval: 1, duration: 2, ring: '#f97316' } },
      trail: { color: 'rgba(249,115,22,0.45)', every: 0.03, life: 0.3 },
    },
  },

  progression: { stack: 1, stack2: 0 },

  hud: {
    stats: [(f) => `Burn Damage/Duration: ${formatHalf(f.stacks)}`],
    statsFr: [(f) => `Brûlure — dégâts/durée : ${formatHalf(f.stacks)}`],
    color: '#e11d1d',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  LUMIÈRE  (LIGHT)
 *  Relevé : vidéos « LIGHT vs FIRE », « LIGHT vs DARK », « LIGHT vs LIGHTNING ».
 * ========================================================================== */
const LIGHT = {
  id: 'light',
  name: 'LUMIÈRE',
  nameRef: 'LIGHT',
  tagline: 'Forteresse — bouclier qui riposte et marteau qui projette',
  icon: 'iconShield',

  look: {
    radius: 41,
    body: '#fbf7a3', // pipette : rgb(252,251,168)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(250,220,60,0.5)',
      radius: 1.75,
      pulse: 1.8,
      showWhen: 'ultimate-ready',
    },
    trail: { color: 'rgba(250,220,60,0.25)', every: 0.05, life: 0.26 },
    accent: '#eab308',
  },

  // marteau lourd : la Lumière est le combattant le plus lent du roster
  movement: { speed: 415, turnRate: 1.6, seek: 0.46, mass: 1 },

  weapon: {
    name: 'Marteau d’aube',
    reach: 155, // mesuré : ~159 px
    spin: SPIN,
    spinDir: 1,
    handle: {
      length: 91,
      width: 11,
      color: '#8b8b8b',
      dark: '#4f4f4f',
      outline: '#141414',
      gem: { at: 0.6, size: 9, color: '#f5d020' },
    },
    head: { sprite: 'lightHammerHead', scale: 4.6, anchorY: 0.5 },
    hitbox: { from: 0.58, to: 1, radius: 22 },
    melee: {
      /**
       * **Les dégâts du marteau SONT la stat « Shield Damage ».**
       * Vérifié image par image : à `Shield Damage: 3` la cible perd 3 PV,
       * à 4-5 elle en perd 5. La Lumière commence donc à 1 dégât par coup et
       * ne devient dangereuse qu'après avoir encaissé.
       */
      damage: (self) => Math.max(1, Math.round(self.stacks)),
      cooldown: 1.5, // arme lourde : la cadence la plus lente du roster
      /** Le recul suit la stat « Knockback » du HUD (1500 → 5400 mesuré). */
      knockback: (self) => 210 + self.stacks2 * 0.05,
      selfRecoil: 60,
      // aucune progression ici : les deux stats montent quand la Lumière
      // ENCAISSE, pas quand elle frappe (voir ability.shield ci-dessous)
    },
  },

  /**
   * Égide — bouclier **permanent et passif** : il absorbe, riposte, et
   * surtout **convertit ce qu'il encaisse en puissance**.
   *
   * Mesuré : la Lumière reste à 100 PV pendant 11 s sous les coups, et à
   * chaque coup encaissé ses deux compteurs montent d'un cran (+1 dégât,
   * +300 de recul) pendant que l'attaquant perd 1 PV. Aucune onde de choc
   * périodique n'apparaît dans les vidéos : l'Égide n'a pas d'incantation.
   */
  ability: {
    id: 'aegis',
    name: 'Égide',
    nameRef: 'Aegis',
    /** Rythme de rechargement du pool (le « sort » ne fait que le remplir). */
    cooldown: 9,
    cooldownStep: 0,
    cooldownFloor: 9,
    shield: {
      /** Capacité = base + « Shield Damage » : le bouclier grossit avec la stat. */
      capacity: (self) => 9 + self.stacks * 0.4,
      /** Régénération après un répit sans encaisser. */
      regen: 2,
      regenDelay: 2.4,
      /** Riposte fixe : 1 PV rendu à l'attaquant (mesuré). */
      reflect: 1,
      reflectCooldown: 0.35,
      /**
       * Gain par coup encaissé — mesuré : +1 et +300, y compris quand une
       * partie des dégâts passe. Seuls les coups **francs** comptent : les
       * dégâts de zone ou sur la durée (blizzard, brûlure) ne font pas monter
       * les compteurs, ce qui a été vérifié pendant un blizzard de 30 PV.
       */
      gainOnHit: { stack: 1, stackMax: 14, stack2: 300, stack2Max: 5400 },
      /**
       * Plafonds **mesurés** : la stat culmine à 14 et le recul à 5400
       * (= 1500 + 13 × 300) sur le duel le plus long. Un court délai de
       * conversion évite qu'une rafale de coups fasse exploser le compteur,
       * qui monte d'environ un cran toutes les trois secondes sur les vidéos.
       */
      gainCooldown: 1.5,
      countedKinds: ['melee', 'projectile', 'bulb', 'chain'],
    },
  },

  ultimate: {
    id: 'radiantSnare',
    name: 'Piège radiant',
    nameRef: 'RADIANT SNARE',
    barLabel: 'RADIANT SNARE',
    barLabelFr: 'PIÈGE RADIANT',
    barFill: '#f2e04a',
    barText: '#3f3000',
    chargeRate: 3.2,
    chargeOnHit: 3,
    duration: 5,
    snare: {
      color: '#f7d34a',
      glow: 'rgba(250,220,60,0.55)',
      width: 7,
      gap: 5, // double trait doré (observé)
      /** La cible prend la teinte de la Lumière tant qu'elle est piégée. */
      tint: '#f8f0b0',
      tintAlpha: 0.92,
      slow: 0.55,
      /** Drain mesuré : 1 PV par seconde, pas davantage. */
      tickInterval: 1,
      tickDamage: 1,
      /** Le piège tire la cible vers la Lumière. */
      pull: 90,
    },
  },

  projectiles: {},

  progression: { stack: 1, stack2: 1500 },

  hud: {
    stats: [
      (f) => `Shield Damage: ${Math.round(f.stacks)}`,
      (f) => `Knockback: ${Math.round(f.stacks2)}`,
    ],
    statsFr: [
      (f) => `Dégâts du bouclier : ${Math.round(f.stacks)}`,
      (f) => `Recul : ${Math.round(f.stacks2)}`,
    ],
    color: '#d9b800',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  VENT  (WIND)
 *  Relevé : vidéo « WIND vs PLANT ».
 * ========================================================================== */
const WIND = {
  id: 'wind',
  name: 'VENT',
  nameRef: 'WIND',
  tagline: 'Harcèlement — le plus rapide, tornades et lames d’air',
  icon: 'iconTornado',

  look: {
    radius: 41,
    body: '#bcbf9e', // pipette : rgb(187,190,158)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(214,205,170,0.55)',
      radius: 1.6,
      pulse: 2.6,
      showWhen: 'ability-ready',
    },
    trail: { color: 'rgba(207,198,168,0.3)', every: 0.035, life: 0.3 },
    accent: '#a89b6f',
  },

  // le plus rapide et le plus manœuvrant du roster (observé)
  movement: { speed: 500, turnRate: 2.2, seek: 0.4, mass: 1 },

  weapon: {
    name: 'Shuriken de bourrasque',
    reach: 105, // mesuré : ~120 px, arme collée au corps
    spin: SPIN * 1.1, // tourne plus vite que les autres (observé)
    spinDir: 1,
    handle: { length: 45, width: 9, color: '#6f6a55', dark: '#3f3b30', outline: '#201c12', gem: null },
    head: { sprite: 'windShuriken', scale: 4.6, anchorY: 0.5 },
    hitbox: { from: 0.45, to: 1, radius: 18 },
    melee: {
      damage: 2,
      cooldown: 1, // cadence la plus rapide du roster
      knockback: 205,
      selfRecoil: 70,
      onHit: { slow: 0.12, slowDuration: 1.2 },
    },
  },

  /** Tornade : la stat monte et la recharge descend à chaque incantation. */
  ability: {
    id: 'tornado',
    name: 'Tornade',
    nameRef: 'Tornado',
    cooldown: 4, // mesuré : 4 s au départ
    cooldownStep: 0.5, // mesuré : −0,5 s par incantation
    cooldownFloor: 1, // mesuré : plancher à 1 s
    tornado: {
      radius: 115,
      duration: 2.2,
      pull: 80,
      tickInterval: 0.7,
      /** « Tornado Damage » du HUD, ramené à l'échelle des PV. */
      tickDamage: (self) => Math.max(1, Math.round(self.stacks / 18)),
      damageGain: 2, // mesuré : 10 → 22 par pas de 2
      damageMax: 24, // plafond observé en fin de duel
      color: 'rgba(198,186,150,0.42)',
      edge: 'rgba(150,138,105,0.55)',
    },
  },

  ultimate: {
    id: 'tempestVolley',
    name: 'Salve de tempête',
    nameRef: 'TEMPEST VOLLEY',
    barLabel: 'TEMPEST VOLLEY',
    barLabelFr: 'SALVE DE TEMPÊTE',
    barFill: '#b9b295',
    barText: '#2a2518',
    chargeRate: 5,
    chargeOnHit: 2,
    duration: 4.5,
    volley: { interval: 0.7, count: 2, spread: 0.9, projectile: 'crescent' },
    speedBonus: 1.25,
  },

  projectiles: {
    crescent: {
      label: 'Lame d’air',
      sprite: 'windCrescent',
      scale: 3,
      speed: 430,
      damage: 1,
      radius: 12,
      life: 2.2,
      bounces: 1,
      knockback: 80,
      trail: { color: 'rgba(207,198,168,0.4)', every: 0.04, life: 0.32 },
    },
  },

  progression: { stack: 10, stack2: 0 },

  hud: {
    stats: [
      (f) => `Tornado Damage: ${Math.round(f.stacks)}`,
      (f) => `Cooldown: ${formatSeconds(f.ability.cooldown)}`,
    ],
    statsFr: [
      (f) => `Dégâts de tornade : ${Math.round(f.stacks)}`,
      (f) => `Recharge : ${formatSeconds(f.ability.cooldown)}`,
    ],
    color: '#8a8163',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  FOUDRE  (LIGHTNING)
 *  Relevé : vidéo « LIGHT vs LIGHTNING ».
 * ========================================================================== */
const LIGHTNING = {
  id: 'lightning',
  name: 'FOUDRE',
  nameRef: 'LIGHTNING',
  tagline: 'Zone — sème des bornes statiques et enchaîne les arcs',
  icon: 'iconBolt',

  look: {
    radius: 41,
    body: '#f2f003', // pipette : rgb(242,240,3)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(56,189,248,0.5)', // halo cyan des arcs (observé)
      radius: 1.65,
      pulse: 4,
      showWhen: 'ultimate-ready',
    },
    trail: { color: 'rgba(125,211,252,0.28)', every: 0.045, life: 0.24 },
    accent: '#38bdf8',
  },

  movement: { speed: 500, turnRate: 2, seek: 0.42, mass: 1 },

  weapon: {
    name: 'Lame fulgurante',
    reach: 145,
    spin: SPIN,
    spinDir: -1,
    handle: { length: 73, width: 10, color: '#8a6d3a', dark: '#513f21', outline: '#1b1408', gem: null },
    head: { sprite: 'boltBlade', scale: 4.5, anchorY: 0.5 },
    hitbox: { from: 0.52, to: 1, radius: 17 },
    melee: {
      damage: 3,
      cooldown: 1,
      knockback: 230,
      selfRecoil: 80,
      onHit: {
        stackGain: 0.5, // « Chain Damage » : 1 → 4,5 mesuré
        stackMax: 14,
        /** Chaque touche plante une borne à l'impact (observé). */
        dropNode: true,
      },
    },
  },

  ability: {
    id: 'staticNode',
    name: 'Borne statique',
    nameRef: 'Static Node',
    cooldown: 3,
    cooldownStep: 0,
    cooldownFloor: 3,
    node: {
      max: 8, // au-delà, la plus ancienne disparaît
      life: 16,
      sprite: 'teslaNode',
      scale: 3,
    },
    chain: {
      interval: 1.6, // cadence des décharges hors ultime
      range: 270, // portée borne → cible
      color: 'rgba(103,232,249,0.95)',
      glow: 'rgba(56,189,248,0.45)',
      width: 4,
      jitter: 14,
      life: 0.28,
      slow: 0.18,
      slowDuration: 0.8,
    },
  },

  ultimate: {
    id: 'supercharge',
    name: 'Surcharge',
    nameRef: 'SUPERCHARGE',
    barLabel: 'SUPERCHARGE',
    barLabelFr: 'SURCHARGE',
    barFill: '#f5e60a',
    barText: '#3a2c05',
    chargeRate: 5.2,
    chargeOnHit: 2,
    duration: 5,
    chainInterval: 0.5, // le réseau crépite en continu
    rangeBonus: 1.5,
    speedBonus: 1.15,
  },

  projectiles: {},

  progression: { stack: 1, stack2: 0 },

  hud: {
    stats: [(f) => `Chain Damage: ${formatHalf(f.stacks)}`],
    statsFr: [(f) => `Dégâts de chaîne : ${formatHalf(f.stacks)}`],
    color: '#d4c800',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  EAU  (WATER)
 *  Relevé : vidéo « FIRE vs WATER ».
 * ========================================================================== */
const WATER = {
  id: 'water',
  name: 'EAU',
  nameRef: 'WATER',
  tagline: 'Contrôle de terrain — des tourbillons qui aspirent et grandissent',
  icon: 'iconDroplet',

  look: {
    radius: 41,
    body: '#4a86f7', // pipette : rgb(67,132,255)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(59,130,246,0.45)',
      radius: 1.65,
      pulse: 1.6,
      showWhen: 'ultimate-ready',
    },
    trail: { color: 'rgba(96,165,250,0.3)', every: 0.045, life: 0.3 },
    accent: '#2563eb',
  },

  movement: { speed: 455, turnRate: 1.8, seek: 0.45, mass: 1 },

  weapon: {
    name: 'Trident des marées',
    reach: 150,
    spin: SPIN,
    spinDir: 1,
    handle: { length: 102, width: 11, color: '#3f6fa8', dark: '#254365', outline: '#0b2545', gem: { at: 0.5, size: 8, color: '#93c5fd' } },
    head: { sprite: 'waterTrident', scale: 4, anchorY: 0.5 },
    hitbox: { from: 0.6, to: 1, radius: 19 },
    melee: {
      damage: 3,
      cooldown: 1.1,
      knockback: 250,
      selfRecoil: 80,
      onHit: {
        stackGain: 1, // « Whirlpool Damage » : 1 → 7 mesuré
        stackMax: 14,
        stack2Gain: 5, // « Size » : 70 → 100 mesuré
        stack2Max: 100,
      },
    },
  },

  ability: {
    id: 'whirlpool',
    name: 'Tourbillon',
    nameRef: 'Whirlpool',
    cooldown: 6,
    cooldownStep: 0,
    cooldownFloor: 6,
    whirlpool: {
      max: 2, // deux tourbillons simultanés au plus
      life: 7.5,
      /** Rayon piloté par la stat « Size » du HUD. */
      radius: (self) => self.stacks2 * 0.9,
      pull: 60,
      tickInterval: 1.2,
      tickDamage: (self) => Math.max(1, Math.round(self.stacks * 0.6)),
      fill: 'rgba(96,165,250,0.30)',
      edge: 'rgba(37,99,235,0.55)',
      arms: 3,
      spin: 2.2,
    },
    /** Chaque tourbillon crache des gouttes. */
    spray: { interval: 1.8, count: 1, projectile: 'droplet' },
  },

  ultimate: {
    id: 'maelstrom',
    name: 'Maelström',
    nameRef: 'MAELSTROM',
    barLabel: 'MAELSTROM',
    barLabelFr: 'MAELSTRÖM',
    barFill: '#4a86f7',
    barText: '#eff6ff',
    chargeRate: 4.2,
    chargeOnHit: 3,
    duration: 5.5,
    maelstrom: {
      radius: 200,
      pull: 170,
      tickInterval: 0.8,
      tickDamage: (self) => Math.max(2, Math.round(self.stacks)),
      spin: 3.4,
      arms: 3,
      fill: 'rgba(59,130,246,0.34)',
      edge: 'rgba(29,78,216,0.7)',
    },
  },

  projectiles: {
    droplet: {
      label: 'Goutte',
      sprite: 'waterDrop',
      scale: 3,
      speed: 330,
      damage: 1,
      radius: 9,
      life: 2,
      bounces: 1,
      knockback: 45,
      trail: { color: 'rgba(147,197,253,0.5)', every: 0.04, life: 0.35, dotted: true },
    },
  },

  progression: { stack: 1, stack2: 70 },

  hud: {
    stats: [
      (f) => `Whirlpool Damage: ${Math.round(f.stacks)}`,
      (f) => `Size: ${Math.round(f.stacks2)}`,
    ],
    statsFr: [
      (f) => `Dégâts du tourbillon : ${Math.round(f.stacks)}`,
      (f) => `Taille : ${Math.round(f.stacks2)}`,
    ],
    color: '#2f6fe0',
    stroke: '#0a0a0a',
  },
};

/* ==========================================================================
 *  PLANTE  (PLANT)
 *  Relevé : vidéos « PLANT vs FIRE », « ICE vs PLANT », « DARK vs PLANT »
 *  et « WIND vs PLANT ».
 * ========================================================================== */
const PLANT = {
  id: 'plant',
  name: 'PLANTE',
  nameRef: 'PLANT',
  tagline: 'Endurance — sème des bulbes qui blessent l’un et soignent l’autre',
  icon: 'iconLeaf',

  look: {
    radius: 41,
    body: '#15c701', // pipette : rgb(21,199,1)
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    outlineWidth: 5,
    hpColor: '#0a0a0a',
    hpFont: '900 34px "Archivo Black", "Arial Black", sans-serif',
    hpOffsetY: 12,
    aura: {
      color: 'rgba(34,197,94,0.45)',
      radius: 1.65,
      pulse: 1.5,
      showWhen: 'ultimate-ready',
    },
    trail: { color: 'rgba(74,222,128,0.26)', every: 0.05, life: 0.28 },
    accent: '#22c55e',
  },

  movement: { speed: 445, turnRate: 1.7, seek: 0.45, mass: 1 },

  /**
   * La liane est **courbe** : elle n'est pas un sprite mais un tracé, dessiné
   * par game/abilities/plant.js (`drawWeapon`). Le reste de la fiche décrit
   * quand même sa géométrie, dont se sert la détection de touche.
   */
  weapon: {
    name: 'Liane fouettante',
    reach: 160, // mesuré : ~164 px
    spin: SPIN,
    spinDir: 1,
    handle: { length: 52, width: 10, color: '#7a5a2a', dark: '#4a3418', outline: '#241a0c', gem: null },
    head: { sprite: null, scale: 1, anchorY: 0.5 },
    /** Tracé de la liane : arc de cercle, épaisseur et teintes. */
    vine: {
      length: 118, // longueur développée de la courbe
      curve: 0.95, // ouverture de l'arc, en radians
      width: 19,
      outline: '#0d1f0a',
      body: '#3aa03a',
      light: '#7fdc6a',
      tip: '#a7f08a',
    },
    hitbox: { from: 0.42, to: 1, radius: 22 },
    melee: {
      damage: 3,
      cooldown: 1.15,
      knockback: 235,
      selfRecoil: 80,
      onHit: {
        stackGain: 1, // « Bulb Damage/Heal » : 1 → 8 mesuré
        stackMax: 14,
      },
    },
  },

  /** Bulbes semés dans l'arène : mine pour l'adversaire, soin pour la Plante. */
  ability: {
    id: 'bulb',
    name: 'Semis',
    nameRef: 'Bulb',
    cooldown: 5,
    cooldownStep: 0,
    cooldownFloor: 5,
    bulb: {
      max: 4,
      life: 18,
      sprite: 'plantBulb',
      scale: 3.4,
      /** Rayon de déclenchement (pour les deux camps). */
      radius: 36,
      /**
       * Délai d'amorçage : sans lui, la Plante ramasserait son propre bulbe
       * à l'instant où elle le pose. Le temps qu'il germe, elle est repartie.
       */
      armDelay: 0.9,
      /** Une fois mûr, le bulbe tire une fleur sur l'adversaire. */
      shootInterval: 2.2,
      shootRange: 460,
      projectile: 'flower',
      /** Dégâts à l'adversaire et soin à la Plante : la stat du HUD. */
      damage: (self) => Math.max(1, Math.round(self.stacks)),
      heal: (self) => Math.max(1, Math.round(self.stacks * 0.8)),
      slow: 0.25,
      slowDuration: 1.6,
    },
  },

  ultimate: {
    id: 'flowerStorm',
    name: 'Tempête de fleurs',
    nameRef: 'FLOWER STORM',
    barLabel: 'FLOWER STORM',
    barLabelFr: 'TEMPÊTE DE FLEURS',
    barFill: '#22c55e',
    barText: '#052e16',
    chargeRate: 4,
    chargeOnHit: 3,
    duration: 5,
    storm: {
      /** Cerceau de lianes qui enferme la cible (observé). */
      cage: { color: '#1f5c22', stud: '#7bd45a', width: 7, studs: 8, scale: 1.35, spin: 0.9 },
      /** Nuée de pétales roses en cubes. */
      petals: { rate: 60, size: 11, speed: 210, life: 1, colors: ['#f9a8d4', '#f472b6', '#ec4899', '#fbcfe8'] },
      root: 0.7, // la cible est quasiment clouée sur place
      tickInterval: 0.7,
      tickDamage: (self) => Math.max(1, Math.round(self.stacks / 4)),
      /** La Plante se régénère pendant sa tempête. */
      healInterval: 1,
      healAmount: 1,
    },
  },

  projectiles: {
    flower: {
      label: 'Fleur',
      sprite: 'flower',
      scale: 3,
      speed: 340,
      damage: 2,
      radius: 12,
      life: 2.4,
      bounces: 0,
      knockback: 60,
      trail: { color: 'rgba(244,114,182,0.45)', every: 0.04, life: 0.4 },
    },
  },

  progression: { stack: 1, stack2: 0 },

  hud: {
    stats: [(f) => `Bulb Damage/Heal: ${Math.round(f.stacks)}`],
    statsFr: [(f) => `Bulbe — dégâts/soin : ${Math.round(f.stacks)}`],
    color: '#16a02c',
    stroke: '#0a0a0a',
  },
};

/** Formatage « 3s » / « 2.4s » identique à la vidéo. */
function formatSeconds(v) {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? `${r}s` : `${r.toFixed(1)}s`;
}

/** Formatage « 4 » / « 4.5 » des stats à demi-pas. */
function formatHalf(v) {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? `${r}` : r.toFixed(1);
}

export const ELEMENTS = deepFreeze({
  shadow: SHADOW,
  ice: ICE,
  fire: FIRE,
  light: LIGHT,
  wind: WIND,
  lightning: LIGHTNING,
  water: WATER,
  plant: PLANT,
});

/** Ordre d'affichage dans l'écran de sélection. */
export const ROSTER = deepFreeze([
  'shadow',
  'ice',
  'fire',
  'water',
  'light',
  'lightning',
  'wind',
  'plant',
]);

/** @param {string} id */
export function getElement(id) {
  const el = ELEMENTS[id];
  if (!el) throw new Error(`Élément inconnu : ${id}`);
  return el;
}
