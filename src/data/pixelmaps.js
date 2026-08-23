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

/**
 * VENT — shuriken en **losange évidé**, collé au corps (aucun manche visible).
 *
 * Relevé image par image sur WIND vs PLANT : anneau en losange de ~74 px de
 * pointe à pointe, **double contour noir épais** (extérieur *et* intérieur du
 * trou), corps crème dégradé (clair côté intérieur, plus chaud côté extérieur)
 * et **quatre ergots gris** qui dépassent aux quatre pointes.
 */
export const WIND_SHURIKEN = deepFreeze({
  w: 17,
  h: 17,
  palette: {
    K: '#0c0a06', // contour, aussi noir que celui des boules
    t: '#e5d2a8', // crème (pipette : rgb(232,220,192))
    l: '#f8f2e0', // reflet, côté intérieur
    s: '#c5a97c', // ombre chaude, côté extérieur
    g: '#bdbcb2', // ergot gris aux pointes
  },
  // Compté bloc par bloc sur la vidéo, du bout de gauche vers le centre :
  // ergot, 2 blocs noirs, 2 blocs crème, 2 blocs noirs, puis le trou.
  rows: [
    '........g........',
    '........K........',
    '.......KKK.......',
    '......KKtKK......',
    '.....KKtltKK.....',
    '....KKtlKltKK....',
    '...KKtlKKKtsKK...',
    '..KKtlKK.KKtsKK..',
    'gKKtlKK...KKtsKKg',
    '..KKtlKK.KKtsKK..',
    '...KKttKKKtsKK...',
    '....KKstKtsKK....',
    '.....KKstsKK.....',
    '......KKsKK......',
    '.......KKK.......',
    '........K........',
    '........g........',
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

/**
 * VENT — croissant de lame d'air : **aucun contour noir**, un vrai croissant
 * (deux cercles décalés) au dégradé doux. Relevé sur WIND vs PLANT : la corne
 * qui traîne est vert-olive sombre, le ventre qui mène est crème, et le dos
 * convexe porte un liseré clair.
 */
export const WIND_CRESCENT = deepFreeze({
  w: 16,
  h: 16,
  palette: {
    d: '#8e7c52', // corne sombre
    t: '#b1a082', // corps
    w: '#c7b99a', // éclairci
    l: '#e6ddc4', // liseré du dos convexe
  },
  rows: [
    '.....ddwwww.....',
    '......ddttww....',
    '.......ddtttw...',
    '........dddttw..',
    '........ddddtww.',
    '.........tttwwl.',
    '.........ttttwl.',
    '.........ttttwl.',
    '.........ttttwl.',
    '.........ttttwl.',
    '.........tttwwl.',
    '........tttwwl..',
    '........ttwwll..',
    '.......twwwll...',
    '......ttwwll....',
    '.....ttlll......',
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
/**
 * PLANTE — bulbe semé : une **cosse verte bombée** au gros contour noir,
 * surmontée d'un pédoncule noir et de deux feuilles sombres, avec deux petites
 * pattes noires en dessous. Relevé : ~29 × 34 px dans l'arène.
 */
export const PLANT_BULB = deepFreeze({
  w: 11,
  h: 15,
  palette: {
    K: '#0a0a0a', // contour noir franc (comme la vidéo)
    v: '#2e7a44', // feuilles, plus sombres que la cosse
    g: '#5aa832', // cosse
    l: '#79c94f', // éclairci
    w: '#a8de7c', // reflet en haut à gauche
    s: '#3b7d1e', // ombre à droite
  },
  rows: [
    '..K.....K..',
    '..KvK.KvK..',
    '..KvvKvvK..',
    '...KvvvK...',
    '....KKK....',
    '...KKKKK...',
    '..KwwlllK..',
    '.KwwlllggK.',
    'KwlllgggggK',
    'KwlllgggssK',
    'KlllgggsssK',
    '.KllgggssK.',
    '..KKgggKK..',
    '...KKKKK...',
    '..KK...KK..',
  ],
});

/**
 * PLANTE — fleur projectile : corolle rose à **contour noir épais** et **cœur
 * doré**, ~40 px, tirée par les bulbes mûrs et emportée par la tempête.
 */
export const FLOWER = deepFreeze({
  w: 11,
  h: 11,
  palette: {
    K: '#100309', // contour noir
    p: '#e878b0', // pétale (pipette : rgb(232,120,176))
    P: '#c9518f', // pétale à l'ombre
    y: '#f0b53c', // cœur doré
    w: '#fbe9b8', // point de lumière au cœur
  },
  rows: [
    '...KK.KK...',
    '..KppKppK..',
    '.KpppppppK.',
    'KpppPPPpppK',
    'KppPPywPppK',
    'KppPyyyPppK',
    'KppPPyyPppK',
    'KpppPPPpppK',
    '.KpppppppK.',
    '..KppKppK..',
    '...KK.KK...',
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
