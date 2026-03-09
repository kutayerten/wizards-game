import Matter from 'matter-js';
import { GAME } from '../constants/config';
import { PLAYER_SPELLS } from '../constants/spells';
import { getMonsterForLevel, getBossHp, getAttackIntervals, getDamageMult } from '../constants/monsters';

import BackgroundRenderer from '../renderers/BackgroundRenderer';
import PlayerRenderer from '../renderers/PlayerRenderer';
import BossRenderer from '../renderers/BossRenderer';

export default function setupEntities({
  bossLevel = 1,
  playerLevel = 1,
  playerHp = null,
  equippedBonuses = {
    damageMult: 1, maxHpBonus: 0, manaRegenBonus: 0,
    playerEmoji: '🧙', staffGlowColor: '#a78bfa',
  },
} = {}) {
  const monster    = getMonsterForLevel(bossLevel);
  const bossMaxHp  = getBossHp(bossLevel);
  const intervals  = getAttackIntervals(bossLevel);
  const bossDmgMul = getDamageMult(bossLevel);

  const playerMaxHp = GAME.PLAYER_MAX_HP + (playerLevel - 1) * 80 + equippedBonuses.maxHpBonus;
  const startHp     = playerHp !== null ? Math.min(playerHp, playerMaxHp) : playerMaxHp;

  const engine = Matter.Engine.create({ enableSleeping: false });
  const world  = engine.world;
  world.gravity.y = 0;
  world.gravity.x = 0;

  const playerBody = Matter.Bodies.rectangle(
    GAME.PLAYER_X, GAME.PLAYER_Y, GAME.PLAYER_W, GAME.PLAYER_H,
    { isStatic: true, isSensor: true, label: 'player' }
  );
  const bossBody = Matter.Bodies.rectangle(
    GAME.BOSS_X, GAME.BOSS_Y, GAME.BOSS_W, GAME.BOSS_H,
    { isStatic: true, isSensor: true, label: 'boss' }
  );
  Matter.World.add(world, [playerBody, bossBody]);

  const cooldowns = {};
  PLAYER_SPELLS.forEach(s => { cooldowns[s.id] = 0; });

  return {
    physics: { engine, world },
    background: { renderer: BackgroundRenderer },

    player: {
      body: playerBody,
      size: [GAME.PLAYER_W, GAME.PLAYER_H],
      hp: startHp,
      maxHp: playerMaxHp,
      mana: GAME.PLAYER_MAX_MANA,
      maxMana: GAME.PLAYER_MAX_MANA,
      level: playerLevel,
      // Item bonusları
      itemDamageMult: equippedBonuses.damageMult,
      manaRegenBonus: equippedBonuses.manaRegenBonus,
      playerEmoji: equippedBonuses.playerEmoji,
      staffGlowColor: equippedBonuses.staffGlowColor,
      spellElement: equippedBonuses.spellElement ?? null,
      extraSpellId: equippedBonuses.extraSpellId ?? null,
      // Buffs
      shielded: false, shieldExpiry: 0,
      invincible: false, invincibleExpiry: 0,
      renderer: PlayerRenderer,
    },

    boss: {
      body: bossBody,
      size: [GAME.BOSS_W, GAME.BOSS_H],
      hp: bossMaxHp,
      maxHp: bossMaxHp,
      phase2Threshold: Math.round(bossMaxHp / 2),
      level: bossLevel,
      phase: 1,
      attackTimer: 1500,
      attackInterval: intervals.p1,
      attackIntervalP2: intervals.p2,
      damageMult: bossDmgMul,
      enraged: false,
      monster,
      renderer: BossRenderer,
    },

    spellCooldowns: { ...cooldowns },
    playerInput: { pendingSpell: null },
    gameState: { status: 'playing', score: 0 },
  };
}
