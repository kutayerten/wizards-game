import { SCREEN_W, GAME } from '../constants/config';
import { BOSS_ATTACKS } from '../constants/spells';
import SpellRenderer from '../renderers/SpellRenderer';

let _uid = 1000;
const uid = () => `boss_${++_uid}`;

function degreesToRad(deg) {
  return (deg * Math.PI) / 180;
}

function spawnBossSpell(entities, attack, angle = Math.PI / 2) {
  const bx = entities.boss.body.position.x;
  const by = entities.boss.body.position.y + GAME.BOSS_H / 2 + 5;
  const mult = entities.boss.damageMult || 1;
  const scaledDamage = Math.round(attack.damage * mult);

  // Use the monster's own halo color so every enemy has unique projectile colors
  const monsterColor = entities.boss.monster?.haloColor;
  const color     = monsterColor || attack.color;
  const glowColor = monsterColor || attack.glowColor;

  if (attack.type === 'single') {
    const id = uid();
    entities[id] = {
      x: bx, y: by,
      vx: Math.cos(angle) * attack.speed,
      vy: Math.sin(angle) * attack.speed,
      damage: scaledDamage,
      radius: attack.radius,
      color,
      glowColor,
      owner: 'boss',
      hit: false,
      renderer: SpellRenderer,
    };
  } else if (attack.type === 'spread') {
    const halfSpread = degreesToRad(attack.spreadDeg / 2);
    const baseAngle = Math.PI / 2;
    const step = (2 * halfSpread) / (attack.count - 1);

    for (let i = 0; i < attack.count; i++) {
      const a = baseAngle - halfSpread + step * i;
      const id = uid();
      entities[id] = {
        x: bx + (i - 2) * 10, y: by,
        vx: Math.cos(a) * attack.speed,
        vy: Math.sin(a) * attack.speed,
        damage: scaledDamage,
        radius: attack.radius,
        color,
        glowColor,
        owner: 'boss',
        hit: false,
        renderer: SpellRenderer,
      };
    }
  }
}

const EnemyAISystem = (entities, { time, dispatch }) => {
  if (entities.gameState.status !== 'playing') return entities;
  if (entities.boss.hp <= 0) return entities;

  const { boss } = entities;
  boss.attackTimer -= time.delta;

  if (boss.attackTimer <= 0) {
    boss.attackTimer = boss.attackInterval;

    // Pick an attack based on phase
    const available = BOSS_ATTACKS.filter(a =>
      boss.phase === 2 || !a.phase2Only
    );

    // Weighted random — phase 2 prefers stronger attacks
    let attack;
    if (boss.phase === 2 && Math.random() < 0.35) {
      attack = available.find(a => a.id === 'enrageBeam') || available[0];
    } else if (Math.random() < 0.5) {
      attack = available.find(a => a.id === 'voidBolt') || available[0];
    } else {
      attack = available.find(a => a.id === 'darkWave') || available[1] || available[0];
    }

    // Aim toward player with slight inaccuracy
    const bx = entities.boss.body.position.x;
    const by = entities.boss.body.position.y;
    const px = entities.player.body.position.x;
    const py = entities.player.body.position.y;

    const aimAngle = Math.atan2(py - by, px - bx) + (Math.random() - 0.5) * 0.3;

    spawnBossSpell(entities, attack, aimAngle);
    dispatch({ type: 'boss-attack', attackId: attack.id });
  }

  return entities;
};

export default EnemyAISystem;
