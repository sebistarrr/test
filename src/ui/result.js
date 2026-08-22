/**
 * Écran de fin de duel (DOM).
 * @module ui/result
 */

export function createResultScreen({ root, onRematch, onBack }) {
  const winnerEl = root.querySelector('#result-winner');
  const detailEl = root.querySelector('#result-detail');
  root.querySelector('#btn-rematch').addEventListener('click', () => onRematch());
  root.querySelector('#btn-back').addEventListener('click', () => onBack());

  return {
    /** @param {{winner:object, loser:object, winnerHp:number, duration:number, hits:number[]}} r */
    show(r) {
      root.classList.remove('hidden');
      root.style.setProperty('--accent', r.winner.look.body);
      winnerEl.textContent = `${r.winner.name} L'EMPORTE`;
      detailEl.textContent =
        `${r.winnerHp} PV restants · duel de ${r.duration.toFixed(1)} s · ` +
        `${r.hits[0] + r.hits[1]} touches`;
    },
    hide() {
      root.classList.add('hidden');
    },
  };
}
