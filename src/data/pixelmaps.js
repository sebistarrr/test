/**
 * Sprites pixel-art décrits en texte (1 caractère = 1 pixel).
 *
 * Aucun binaire dans le dépôt : les sprites sont « compilés » en canvas hors
 * écran au démarrage (voir render/pixelart.js). Chaque sprite reste
 * remplaçable par un PNG maison — voir assets/sprites/README.md.
 *
 * Convention : le sprite est dessiné **pointe vers la droite** (angle 0).
 *
 * @module data/pixelmaps
 */

import { deepFreeze } from './freeze.js';

/* ------------------------------------------------------------------
 * OMBRE — lame dentelée sombre à gemme violette
 * Relevé vidéo : lame ~63 px de long / 28 px de haut, gemme près de la garde.
 * ------------------------------------------------------------------ */
export const DARK_BLADE = deepFreeze({
  w: 20,
  h: 9,
  palette: {
    K: '#0b0710', // contour
    P: '#3b2350', // corps de lame
    L: '#4a2c66', // reflet haut
    G: '#8b5cf6', // gemme
  },
  rows: [
    '..KKKKKKKKKKKKKK....',
    '.KLLLLLLLLLLLLLLKK..',
    'KLLLLLLLLLLLLLLLLKK.',
    'KPGGPPPPPPPPPPPPPPKK',
    'KPGGPPPPPPPPPPPPPPPK',
    'KPGGPPPPPPPPPPPPPPKK',
    'KPPPPPPPPPPPPPPPPKK.',
    '.KPPPPPPPPPPPPPPKK..',
    '..KKKKKKKKKKKKKK....',
  ],
});

/* ------------------------------------------------------------------
 * GLACE — tête de hache double en cristal
 * Relevé vidéo : ~42 px de large / 60 px de haut au bout d'un long manche.
 * ------------------------------------------------------------------ */
export const ICE_AXE_HEAD = deepFreeze({
  w: 12,
  h: 17,
  palette: {
    K: '#0d0d12',
    I: '#d8f2ff', // cristal clair
    b: '#67b6e0', // cristal profond
    w: '#ffffff', // éclat
  },
  rows: [
    '....KKKK....',
    '...KKIIKK...',
    '..KKIIIIKK..',
    '..KIIwIbIK..',
    '.KKIIwwIbKK.',
    '.KIIIwwIbIK.',
    'KKIbbIIIbIIK',
    'KIbbIIbbIbIK',
    'KIIIIIIIIbIK',
    'KIbbIIbbIbIK',
    'KKIbbIIIbIIK',
    '.KIIIwwIbIK.',
    '.KKIIwwIbKK.',
    '..KIIwIbIK..',
    '..KKIIIIKK..',
    '...KKIIKK...',
    '....KKKK....',
  ],
});

/* ------------------------------------------------------------------
 * Projectile de Glace — éclat en goutte, laisse une traînée pointillée
 * ------------------------------------------------------------------ */
export const ICE_SHARD = deepFreeze({
  w: 8,
  h: 11,
  palette: { K: '#0d2b3a', I: '#cfeffd', w: '#ffffff', b: '#7cc7ea' },
  rows: [
    '...KK...',
    '..KIIK..',
    '.KIIIIK.',
    '.KIwIIK.',
    'KIIwIIIK',
    'KIIwIIbK',
    'KIIIIIbK',
    '.KIIIbK.',
    '.KIIbK..',
    '..KIK...',
    '...K....',
  ],
});

/* ------------------------------------------------------------------
 * Icônes du titre (16x16, style Minecraft comme sur la vidéo)
 * ------------------------------------------------------------------ */
export const ORB_DARK = deepFreeze({
  w: 16,
  h: 16,
  palette: {
    K: '#0b0710',
    v: '#5b21a6', // anneau externe
    d: '#241a33', // matière sombre
    m: '#8b5cf6', // cœur violet
    w: '#c4b5fd',
  },
  rows: [
    '.....KKKKKK.....',
    '...KKvvvvvvKK...',
    '..KvvvvvvvvvvK..',
    '.KvvvvKKKKvvvvK.',
    '.KvvvKddddKvvvK.',
    'KvvvKddddddKvvvK',
    'KvvKdddmmdddKvvK',
    'KvvKddmwwmddKvvK',
    'KvvKddmwwmddKvvK',
    'KvvKdddmmdddKvvK',
    'KvvvKddddddKvvvK',
    '.KvvvKddddKvvvK.',
    '.KvvvvKKKKvvvvK.',
    '..KvvvvvvvvvvK..',
    '...KKvvvvvvKK...',
    '.....KKKKKK.....',
  ],
});

export const SNOWFLAKE = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#2b6f95', I: '#8ecbee', w: '#ffffff' },
  rows: [
    '.......KK.......',
    '...I...II...I...',
    '....I..II..I....',
    '.I...I.II.I...I.',
    '..I...IIII...I..',
    '...I..IIII..I...',
    '....IIIIIIII....',
    'KIIIIIIwwIIIIIIK',
    'KIIIIIIwwIIIIIIK',
    '....IIIIIIII....',
    '...I..IIII..I...',
    '..I...IIII...I..',
    '.I...I.II.I...I.',
    '....I..II..I....',
    '...I...II...I...',
    '.......KK.......',
  ],
});

/* ==================================================================
 *  ARMES DES CINQ NOUVEAUX ÉLÉMENTS
 *  (relevées sur les vidéos LIGHT vs FIRE, WIND vs PLANT,
 *   LIGHT vs LIGHTNING et FIRE vs WATER)
 * ================================================================== */

/** FEU — lame de flamme : cœur blanc, corps orange, liseré rouge sombre. */
export const FIRE_BLADE = deepFreeze({
  w: 18,
  h: 10,
  palette: {
    K: '#2a0d02',
    o: '#f2670c', // orange
    y: '#fbbf24', // jaune
    w: '#fff4c4', // cœur incandescent
  },
  rows: [
    '.....KKKKKK.......',
    '...KKoooooKKKK....',
    '..KooyyyyyoooKKK..',
    '.KoyywwwwwyyyooKK.',
    'KoyywwwwwwwwyyyooK',
    'KoyywwwwwwwwyyyooK',
    '.KoyywwwwwyyyooKK.',
    '..KooyyyyyoooKKK..',
    '...KKoooooKKKK....',
    '.....KKKKKK.......',
  ],
});

/** LUMIÈRE — tête de marteau : bloc doré à panneau clair. */
export const LIGHT_HAMMER_HEAD = deepFreeze({
  w: 14,
  h: 17,
  palette: {
    K: '#2a2007',
    g: '#e0bd1e', // or
    l: '#fdf6b8', // panneau clair
  },
  rows: [
    '..KKKKKKKKKK..',
    '.KggggggggggK.',
    'KggggggggggggK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KgllllllllllgK',
    'KggggggggggggK',
    '.KggggggggggK.',
    '..KKKKKKKKKK..',
  ],
});

/** VENT — shuriken en losange évidé, collé au corps (manche très court). */
export const WIND_SHURIKEN = deepFreeze({
  w: 13,
  h: 13,
  palette: {
    K: '#3a3016',
    t: '#d9c89a', // tan
    l: '#f4ecd2', // reflet
  },
  rows: [
    '......K......',
    '.....KtK.....',
    '....KtltK....',
    '...KttKttK...',
    '..KttK.KttK..',
    '.KttK...KttK.',
    'KltK.....KtlK',
    '.KttK...KttK.',
    '..KttK.KttK..',
    '...KttKttK...',
    '....KtltK....',
    '.....KtK.....',
    '......K......',
  ],
});

/** FOUDRE — lame en éclair. */
export const BOLT_BLADE = deepFreeze({
  w: 16,
  h: 12,
  palette: {
    K: '#3a2c05',
    y: '#f5e60a',
    w: '#fffbb0',
  },
  rows: [
    '..........KKKK..',
    '.........KyyyK..',
    '........KyyyKK..',
    '.....KKKyyyK....',
    '...KKyyyyyyK....',
    '.KKKyywwwyyyKKKK',
    'KyywwwwwyyyyyyyK',
    '.KKKyywwwyyyKKKK',
    '...KKyyyyyyK....',
    '.....KKKyyyK....',
    '........KyyyKK..',
    '.........KKKK...',
  ],
});

/** EAU — tête de trident à trois dents. */
export const WATER_TRIDENT = deepFreeze({
  w: 12,
  h: 15,
  palette: {
    K: '#0b2545',
    b: '#7fb2f0', // bleu clair
    w: '#dbeafe', // reflet
  },
  rows: [
    '.....KKKKKK.',
    '.....KbbbbK.',
    '.KKKKKbwbKK.',
    '.KbbbbbbbK..',
    '.KbbKKKKK...',
    '.KbbK.......',
    '.KbbKKKKKKK.',
    '.KbwbbbbbbbK',
    '.KbbKKKKKKK.',
    '.KbbK.......',
    '.KbbKKKKK...',
    '.KbbbbbbbK..',
    '.KKKKKbwbKK.',
    '.....KbbbbK.',
    '.....KKKKKK.',
  ],
});

/* ---------------- projectiles ---------------- */

/** FEU — braise. */
export const EMBER = deepFreeze({
  w: 7,
  h: 7,
  palette: { K: '#2a0d02', o: '#f2670c', y: '#fbbf24', w: '#fff4c4' },
  rows: ['..KKK..', '.KoyoK.', 'KoywyoK', 'KywwwyK', 'KoywyoK', '.KoyoK.', '..KKK..'],
});

/** VENT — croissant de lame d'air, sans contour (dégradé doux comme la vidéo). */
export const WIND_CRESCENT = deepFreeze({
  w: 12,
  h: 14,
  palette: { d: '#b3a887', t: '#cfc6a8', l: '#eee7d0' },
  rows: [
    '.......ddd..',
    '.....ddtttd.',
    '....dtttlttd',
    '...dtttl..tt',
    '..dtttl....t',
    '..dttl......',
    '..dtt.......',
    '..dtt.......',
    '..dttl......',
    '..dtttl....t',
    '...dtttl..tt',
    '....dtttlttd',
    '.....ddtttd.',
    '.......ddd..',
  ],
});

/** EAU — gouttelette projetée par les tourbillons. */
export const WATER_DROP = deepFreeze({
  w: 6,
  h: 8,
  palette: { K: '#0b2545', b: '#5a9bef', w: '#dbeafe' },
  rows: ['..KK..', '.KbbK.', '.KbbK.', 'KbwbbK', 'KbwbbK', 'KbbbbK', '.KbbK.', '..KK..'],
});

/** FOUDRE — borne statique posée dans l'arène (relais des chaînes). */
export const TESLA_NODE = deepFreeze({
  w: 9,
  h: 11,
  palette: { K: '#1e3a4c', b: '#7dd3fc', w: '#ffffff' },
  rows: [
    '....K....',
    '...KwK...',
    '..KwbwK..',
    '.KbwbwbK.',
    'KbwbbbwbK',
    '.KbbbbbK.',
    '..KbbbK..',
    '.KbbbbbK.',
    '..KbbbK..',
    '.KKKKKKK.',
    '..KKKKK..',
  ],
});

/* ---------------- icônes de titre ---------------- */

export const ICON_FLAME = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#2a0d02', o: '#f2670c', y: '#fbbf24', w: '#fff4c4' },
  rows: [
    '.......KK.......',
    '......KooK......',
    '.....KoyyoK.....',
    '....KoyyyyoK....',
    '....KoyywyoK....',
    '...KooywwwyoK...',
    '...KoyywwwyyoK..',
    '..KooywwwwwyooK.',
    '..KoyywwwwwyyoK.',
    '.KooywwwwwwwyoK.',
    '.KoyywwwwwwwyoK.',
    '.KoyywwwwwwwyoK.',
    '.KooyywwwwwyyoK.',
    '..KooyywwwyyooK.',
    '...KKooyyyyooK..',
    '.....KKKKKKKK...',
  ],
});

export const ICON_SHIELD = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#2a2007', g: '#e0bd1e', l: '#fdf6b8', w: '#ffffff' },
  rows: [
    '..KKKKKKKKKKKK..',
    '.KggggggggggggK.',
    '.KgllllllllllgK.',
    '.KgllwwwwwwllgK.',
    '.KgllwwwwwwllgK.',
    '.KgllllwwllllgK.',
    '.KgllllwwllllgK.',
    '.KgllllwwllllgK.',
    '..KgllllllllgK..',
    '..KgllllllllgK..',
    '...KgllllllgK...',
    '....KgllllgK....',
    '.....KgllgK.....',
    '......KggK......',
    '.......KK.......',
    '................',
  ],
});

export const ICON_TORNADO = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#3a3016', t: '#d9c89a' },
  rows: [
    '..KKKKKKKKKKKK..',
    '.KttttttttttttK.',
    '..KKttttttttKK..',
    '...KttttttttK...',
    '....KKtttttK....',
    '.....KtttttK....',
    '.....KKtttKK....',
    '......KtttK.....',
    '......KKtKK.....',
    '.......KtK......',
    '.......KtK......',
    '........K.......',
    '................',
    '................',
    '................',
    '................',
  ],
});

export const ICON_BOLT = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#3a2c05', y: '#f5e60a', w: '#fffbb0' },
  rows: [
    '.........KKKK...',
    '........KyyyK...',
    '.......KyyyK....',
    '......KyyyK.....',
    '.....KyyyKKKKK..',
    '....KyyyyyyyyK..',
    '...KyywwwwyyyK..',
    '..KKyywwwwyyKK..',
    '..KyyywwwyyK....',
    '..KKKyyyyyK.....',
    '....KyyyyK......',
    '...KyyyyK.......',
    '..KyyyK.........',
    '..KyyK..........',
    '..KKK...........',
    '................',
  ],
});

export const ICON_DROPLET = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#0b2545', b: '#5a9bef', w: '#dbeafe' },
  rows: [
    '.......KK.......',
    '......KbbK......',
    '......KbbK......',
    '.....KbbbbK.....',
    '.....KbbbbK.....',
    '....KbbwbbbK....',
    '....KbwwbbbK....',
    '...KbbwwbbbbK...',
    '...KbbwwbbbbK...',
    '..KbbbwwbbbbbK..',
    '..KbbbwwbbbbbK..',
    '..KbbbwwbbbbbK..',
    '...KbbbwbbbbK...',
    '....KbbbbbbK....',
    '.....KKbbKK.....',
    '.......KK.......',
  ],
});

/* ------------------------------------------------------------------
 * PLANTE — bulbe semé dans l'arène, fleur projectile, icône du titre
 * Relevé : vidéos PLANT vs FIRE / ICE vs PLANT / DARK vs PLANT.
 * (La liane, elle, est dessinée en courbe par game/abilities/plant.js.)
 * ------------------------------------------------------------------ */
export const PLANT_BULB = deepFreeze({
  w: 9,
  h: 11,
  palette: {
    K: '#4a6b4a', // contour vert-gris
    b: '#cfe8bf', // bulbe pâle
    l: '#8fce7a', // feuilles
    w: '#eef7e6', // reflet
  },
  rows: [
    '..K...K..',
    '.KlK.KlK.',
    '.KllKllK.',
    '..KlllK..',
    '...KlK...',
    '..KbbbK..',
    '.KbwwbbK.',
    'KbwwbbbbK',
    'KbwbbbbbK',
    '.KbbbbbK.',
    '..KKKKK..',
  ],
});

export const FLOWER = deepFreeze({
  w: 9,
  h: 9,
  palette: {
    K: '#a3316b',
    p: '#f472b6', // pétale
    P: '#ec4899', // pétale sombre
    y: '#fde047', // cœur
  },
  rows: [
    '..KK.KK..',
    '.KppKppK.',
    'KpppppppK',
    'KppPyPppK',
    'KppyyyppK',
    'KppPyPppK',
    'KpppppppK',
    '.KppKppK.',
    '..KK.KK..',
  ],
});

export const ICON_LEAF = deepFreeze({
  w: 16,
  h: 16,
  palette: { K: '#14532d', l: '#4ade80', g: '#22c55e' },
  rows: [
    '.........KKK....',
    '.......KKlllK...',
    '......KlllllK...',
    '.....KllllllK...',
    '..KKKllllllKK...',
    '.KlllllllKK.....',
    'KlllllKK..g.....',
    '.KlllKK...g.....',
    '..KKK.....g.....',
    '..........g.....',
    '.......KKgggKK..',
    '......KgggggggK.',
    '......KgggggggK.',
    '.......KKgggKK..',
    '.........KKK....',
    '................',
  ],
});

/** Table des sprites : clé → description. Les clés servent aux overrides PNG. */
export const PIXEL_MAPS = deepFreeze({
  // Ombre & Glace
  darkBlade: DARK_BLADE,
  iceAxeHead: ICE_AXE_HEAD,
  iceShard: ICE_SHARD,
  orbDark: ORB_DARK,
  snowflake: SNOWFLAKE,
  // armes
  fireBlade: FIRE_BLADE,
  lightHammerHead: LIGHT_HAMMER_HEAD,
  windShuriken: WIND_SHURIKEN,
  boltBlade: BOLT_BLADE,
  waterTrident: WATER_TRIDENT,
  // projectiles & entités
  ember: EMBER,
  windCrescent: WIND_CRESCENT,
  waterDrop: WATER_DROP,
  teslaNode: TESLA_NODE,
  // plante
  plantBulb: PLANT_BULB,
  flower: FLOWER,
  // icônes
  iconFlame: ICON_FLAME,
  iconShield: ICON_SHIELD,
  iconTornado: ICON_TORNADO,
  iconBolt: ICON_BOLT,
  iconDroplet: ICON_DROPLET,
  iconLeaf: ICON_LEAF,
});
