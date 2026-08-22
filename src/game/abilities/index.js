/**
 * Registre des modules de pouvoirs.
 *
 * Un module implémente : init / update / drawUnder / drawOver / barValue.
 * Ajouter un élément = ajouter sa fiche + son module ici.
 *
 * @module game/abilities
 */

import { shadowAbilities } from './shadow.js';
import { iceAbilities } from './ice.js';

const REGISTRY = {
  shadow: shadowAbilities,
  ice: iceAbilities,
};

/** Module neutre : sert de repli pour un élément sans pouvoirs dédiés. */
const NOOP = {
  id: 'noop',
  init() {},
  update() {},
  drawUnder() {},
  drawOver() {},
  barValue: (f) => f.ult.charge / 100,
};

export function abilitiesFor(elementId) {
  return REGISTRY[elementId] ?? NOOP;
}
