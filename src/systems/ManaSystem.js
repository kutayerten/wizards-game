import { GAME } from '../constants/config';

let _lastManaDispatch = 0;

const ManaSystem = (entities, { time, dispatch }) => {
  if (entities.gameState.status !== 'playing') return entities;

  const { player } = entities;
  const delta = time.delta / 1000; // seconds

  // Regenerate mana
  if (player.mana < player.maxMana) {
    const totalRegen = GAME.MANA_REGEN + (player.manaRegenBonus || 0);
    player.mana = Math.min(player.maxMana, player.mana + totalRegen * delta);

    // Throttle dispatch to once per 200ms
    const now = Date.now();
    if (now - _lastManaDispatch > 200) {
      _lastManaDispatch = now;
      dispatch({ type: 'mana-update', mana: player.mana });
    }
  }

  return entities;
};

export default ManaSystem;
