/**
 * Point d'entrée : chargement des ressources, câblage des écrans, boucle.
 *
 * Paramètres d'URL utiles :
 *   ?a=shadow&b=ice   duel direct, sans passer par la sélection
 *   ?seed=1234        rejoue exactement le même duel
 *   ?lang=fr          libellés du HUD en français (par défaut : ceux de la vidéo)
 *   ?debug=1          hitboxes + compteurs
 *
 * @module main
 */

import { createStage } from './render/canvas.js';
import { createLoop } from './core/loop.js';
import { loadSprites } from './render/sprites.js';
import { ensureFonts } from './core/fonts.js';
import { createRng, seedFromLocation } from './core/rng.js';
import { ELEMENTS } from './data/elements.js';
import { Match } from './game/match.js';
import { createSelectScreen } from './ui/select.js';
import { createResultScreen } from './ui/result.js';

const params = new URLSearchParams(location.search);
const LANG = params.get('lang') === 'fr' ? 'fr' : 'ref';
const DEBUG = params.get('debug') === '1';

const canvas = document.querySelector('#stage');
const stage = createStage(canvas);

/** @type {Match|null} */
let match = null;

const loop = createLoop({
  update: (dt) => match?.update(dt),
  render: () => {
    stage.begin();
    if (match) match.draw(stage.ctx);
  },
});

const selectScreen = createSelectScreen({
  root: document.querySelector('#screen-select'),
  onStart: (pair) => startMatch(pair),
});

const resultScreen = createResultScreen({
  root: document.querySelector('#screen-result'),
  onRematch: () => startMatch(lastPair),
  onBack: () => {
    resultScreen.hide();
    loop.stop();
    match = null;
    selectScreen.show();
  },
});

/** @type {[string,string]} */
let lastPair = ['shadow', 'ice'];

function startMatch(pair) {
  lastPair = pair;
  selectScreen.hide();
  resultScreen.hide();

  const seed = seedFromLocation();
  match = new Match({
    elements: pair,
    rng: createRng(seed),
    lang: LANG,
    debug: DEBUG,
    onEnd: (result) => {
      loop.stop();
      resultScreen.show(result);
    },
  });
  loop.start();
}

/* --------------------------------------------------------------- */

async function boot() {
  await Promise.all([loadSprites(), ensureFonts()]);

  const a = params.get('a');
  const b = params.get('b');
  if (a && b && ELEMENTS[a] && ELEMENTS[b]) {
    startMatch([a, b]);
  } else {
    selectScreen.show();
    // une frame « à vide » pour que le décor soit déjà là derrière l'overlay
    stage.begin();
  }
}

// Met la boucle en pause quand l'onglet passe en arrière-plan.
document.addEventListener('visibilitychange', () => {
  if (!match || match.phase === 'over') return;
  if (document.hidden) loop.stop();
  else loop.start();
});

boot();
