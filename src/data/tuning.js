/**
 * Constantes de scène relevées **image par image** sur la vidéo de référence
 * (720x1280, 30 fps, 60,4 s). Chaque valeur porte la mesure d'origine.
 *
 * Ces valeurs décrivent le *décor* et la *mise en page* : elles ne changent
 * jamais, d'un duel à l'autre comme d'un élément à l'autre.
 *
 * @module data/tuning
 */

import { deepFreeze } from './freeze.js';

export const STAGE = deepFreeze({
  width: 720, // = résolution de la vidéo source
  height: 1280,
  paper: '#f9f1da', // pipette hors-arène : rgb(249,241,218)
});

export const ARENA = deepFreeze({
  // Bord extérieur noir mesuré : x 40→679, y 320→959 (soit 640x640)
  x: 40,
  y: 320,
  size: 640,
  border: 6, // épaisseur du trait noir (mesurée 6 px)
  fill: '#ffffff',
  stroke: '#000000',
  // surface de jeu réelle (intérieur du trait)
  get inner() {
    return {
      left: this.x + this.border,
      top: this.y + this.border,
      right: this.x + this.size - this.border,
      bottom: this.y + this.size - this.border,
    };
  },
});

export const TITLE = deepFreeze({
  // Titre mesuré : hauteur de casse 247→310 px, centré sur x = 361
  centerX: 361,
  baseline: 310,
  fontSize: 58,
  gap: 14, // espace entre les blocs texte/icône
  iconSize: 52,
  vsColor: '#ffffff',
  vsSize: 40,
  stroke: '#000000',
  strokeWidth: 7,
});

export const WATERMARK = deepFreeze({
  text: '@ElementalArmoryLeague',
  centerX: 360,
  baseline: 930, // mesuré : lignes 908→932
  fontSize: 26,
  color: 'rgba(120,120,120,0.42)',
});

export const HUD = deepFreeze({
  // Deux jauges d'ultime, mesurées : x 39→307 et 412→680, y 965→1000
  bar: {
    y: 965,
    height: 35,
    width: 268,
    leftX: 39,
    rightX: 412,
    border: 2,
    labelSize: 22,
    labelPad: 8,
  },
  // Lignes de statistique sous les jauges : glyphes 1005→1038.
  // Certains éléments en affichent deux (Lumière : dégâts + recul,
  // Eau : dégâts + taille) — interligne mesuré sur ces vidéos : 31 px.
  stat: {
    baseline: 1036,
    lineHeight: 31,
    fontSize: 30,
    leftX: 39,
    rightX: 681,
    strokeWidth: 5,
  },
});

/** Physique commune à tous les éléments (le « moteur »). */
export const PHYSICS = deepFreeze({
  /** Restitution des rebonds sur les murs (1 = parfaitement élastique). */
  wallRestitution: 1,
  /** Restitution du choc corps à corps. */
  bodyRestitution: 1,
  /** Vitesse de retour à la vitesse nominale après un recul (1/s). */
  speedRecovery: 3.2,
  /** Impulsion minimale de séparation quand deux corps s'interpénètrent. */
  separationBias: 0.6,
  /** Durée du flash blanc encaissé (mesurée ~6 images à 30 fps). */
  hitFlash: 0.2,
  /** Le sens de rotation de l'arme s'inverse aux rebonds (observé). */
  spinFlipsOnBounce: true,
});

export const MATCH = deepFreeze({
  maxHp: 100,
  /** Petit temps mort avant l'engagement, le décor est déjà en place. */
  introDuration: 0.9,
  /** Ralenti + explosion au K.O. avant l'écran de résultat. */
  koDuration: 1.8,
  koSlowmo: 0.25,
  /**
   * Mort subite : au-delà de `after`, tous les dégâts sont amplifiés
   * progressivement. Garantit qu'aucun duel ne s'éternise, y compris entre
   * deux combattants très défensifs (miroir Lumière contre Lumière).
   */
  suddenDeath: { after: 55, ramp: 18, max: 4 },
  /** Positions de départ mesurées sur la première image (fractions d'arène). */
  spawn: [
    { x: 0.29, y: 0.5, heading: -0.35 },
    { x: 0.71, y: 0.5, heading: Math.PI + 0.35 },
  ],
});
