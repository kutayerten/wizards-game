import Matter from 'matter-js';
import { SCREEN_W, SCREEN_H, GAME, COLORS } from '../constants/config';
import { PLAYER_SPELLS, EXTRA_SPELLS } from '../constants/spells';
import { getPlayerDamageMult } from '../constants/monsters';
import SpellRenderer from '../renderers/SpellRenderer';
import ParticleRenderer from '../renderers/ParticleRenderer';
import ZigzagRenderer from '../renderers/ZigzagRenderer';

// ─── Helpers ────────────────────────────────────────────────────────────────

let _uid = 0;
const uid = () => `e_${++_uid}_${Date.now()}`;

function spawnParticles(entities, x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 2 + Math.random() * 4;
    const id = uid();
    entities[id] = {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.025 + Math.random() * 0.02,
      color,
      radius: 3 + Math.random() * 4,
      renderer: ParticleRenderer,
    };
  }
}

function aabbHit(sx, sy, sr, tx, ty, tw, th) {
  return (
    sx + sr > tx - tw / 2 &&
    sx - sr < tx + tw / 2 &&
    sy + sr > ty - th / 2 &&
    sy - sr < ty + th / 2
  );
}

function castPlayerSpell(entities, spellDef, dispatch) {
  const { player, spellCooldowns } = entities;
  const now = Date.now();

  // Cooldown check
  if (spellCooldowns[spellDef.id] > now) return;
  // Mana check
  if (player.mana < spellDef.manaCost) {
    dispatch({ type: 'no-mana' });
    return;
  }

  // Consume mana & set cooldown
  player.mana = Math.max(0, player.mana - spellDef.manaCost);
  spellCooldowns[spellDef.id] = now + spellDef.cooldown;

  dispatch({ type: 'mana-update', mana: player.mana });
  dispatch({ type: 'cooldown-update', cooldowns: { ...spellCooldowns } });

  if (spellDef.type === 'beam') {
    // Instant-hit beam — damages boss immediately, then shows zigzag visual
    const dmgMult = getPlayerDamageMult(player.level || 1) * (player.itemDamageMult || 1);
    const damage  = Math.round(spellDef.damage * dmgMult);
    const newHp   = Math.max(0, entities.boss.hp - damage);
    entities.boss.hp = newHp;

    if (entities.boss.hp <= entities.boss.phase2Threshold && entities.boss.phase === 1) {
      entities.boss.phase = 2;
      entities.boss.enraged = true;
      entities.boss.attackInterval = entities.boss.attackIntervalP2;
      dispatch({ type: 'boss-phase2' });
    }
    dispatch({ type: 'boss-hit', bossHp: newHp, damage });
    spawnParticles(entities, entities.boss.body.position.x, entities.boss.body.position.y, spellDef.glowColor, 14);
    if (newHp <= 0) {
      entities.gameState.status = 'victory';
      dispatch({ type: 'game-over', result: 'victory' });
    }

    // Pre-generate stable zigzag offsets (so beam doesn't flicker each frame)
    const N = 9;
    const zigzagOffsets = Array.from({ length: N }, (_, i) =>
      (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 14)
    );

    const px = player.body.position.x;
    const py = player.body.position.y - GAME.PLAYER_H / 2;
    const bx = entities.boss.body.position.x;
    const by = entities.boss.body.position.y + GAME.BOSS_H / 2;

    const id = uid();
    entities[id] = {
      x1: px, y1: py, x2: bx, y2: by,
      zigzagOffsets,
      life: 380, maxLife: 380,
      color: spellDef.color,
      glowColor: spellDef.glowColor,
      renderer: ZigzagRenderer,
    };
    return;
  }

  if (spellDef.type === 'buff') {
    if (spellDef.id === 'shield') {
      player.shielded = true;
      player.shieldExpiry = now + spellDef.duration;
      dispatch({ type: 'shield-update', shielded: true });
    } else if (spellDef.id === 'flash') {
      player.invincible = true;
      player.invincibleExpiry = now + spellDef.duration;
      dispatch({ type: 'flash-update', invincible: true });
    }
    return;
  }

  // Projectile spell — hasar player level'a göre ölçeklenir
  const px = player.body.position.x;
  const py = player.body.position.y - GAME.PLAYER_H / 2 - 5;
  // Level çarpanı × item çarpanı
  const dmgMult = getPlayerDamageMult(player.level || 1) * (player.itemDamageMult || 1);

  // %35 ihtimalle sağa/sola sapma
  const missRoll = Math.random();
  const vx = missRoll < 0.35 ? (Math.random() - 0.5) * spellDef.speed * 1.4 : 0;

  const id = uid();
  entities[id] = {
    x: px,
    y: py,
    vx,
    vy: -spellDef.speed,
    damage: Math.round(spellDef.damage * dmgMult),
    radius: spellDef.radius,
    color: spellDef.color,
    glowColor: spellDef.glowColor,
    element: player.spellElement || null,
    owner: 'player',
    hit: false,
    renderer: SpellRenderer,
  };
}

// ─── Main System ─────────────────────────────────────────────────────────────

const SpellSystem = (entities, { time, dispatch }) => {
  if (entities.gameState.status !== 'playing') return entities;

  const delta = time.delta / 1000; // seconds
  const now = Date.now();
  const { player, boss } = entities;

  // ── 1. Handle pending player spell input ──────────────────────────────────
  const pending = entities.playerInput.pendingSpell;
  if (pending) {
    entities.playerInput.pendingSpell = null;
    const spellDef = PLAYER_SPELLS.find(s => s.id === pending)
      || EXTRA_SPELLS.find(s => s.id === pending);
    if (spellDef) castPlayerSpell(entities, spellDef, dispatch);
  }

  // ── 2. Expire buffs ───────────────────────────────────────────────────────
  if (player.shielded && now > player.shieldExpiry) {
    player.shielded = false;
    dispatch({ type: 'shield-update', shielded: false });
  }
  if (player.invincible && now > player.invincibleExpiry) {
    player.invincible = false;
    dispatch({ type: 'flash-update', invincible: false });
  }

  // ── 3. Move projectiles & check collisions ────────────────────────────────
  const toRemove = [];

  Object.keys(entities).forEach(key => {
    const e = entities[key];
    if (!e || e.renderer !== SpellRenderer) return;

    // Move
    e.x += e.vx;
    e.y += e.vy;

    // Out-of-bounds
    if (e.y < GAME.ARENA_TOP - 40 || e.y > GAME.ARENA_BOTTOM + 40 ||
        e.x < -40 || e.x > SCREEN_W + 40) {
      toRemove.push(key);
      return;
    }

    if (e.hit) {
      toRemove.push(key);
      return;
    }

    // Player spell hits boss
    if (e.owner === 'player') {
      const bx = boss.body.position.x;
      const by = boss.body.position.y;
      if (aabbHit(e.x, e.y, e.radius, bx, by, GAME.BOSS_W, GAME.BOSS_H)) {
        e.hit = true;
        const newHp = Math.max(0, boss.hp - e.damage);
        boss.hp = newHp;

        // Phase 2 transition
        if (boss.hp <= boss.phase2Threshold && boss.phase === 1) {
          boss.phase = 2;
          boss.enraged = true;
          boss.attackInterval = boss.attackIntervalP2;
          dispatch({ type: 'boss-phase2' });
        }

        dispatch({ type: 'boss-hit', bossHp: newHp, damage: e.damage });
        const hitColor = e.element === 'fire' ? '#f97316'
          : e.element === 'lightning' ? '#fbbf24'
          : e.element === 'cold'      ? '#7dd3fc'
          : (e.glowColor);
        spawnParticles(entities, e.x, e.y, hitColor, 12);

        if (newHp <= 0) {
          entities.gameState.status = 'victory';
          dispatch({ type: 'game-over', result: 'victory' });
        }

        toRemove.push(key);
        return;
      }
    }

    // Boss spell hits player
    if (e.owner === 'boss') {
      const px = player.body.position.x;
      const py = player.body.position.y;
      if (aabbHit(e.x, e.y, e.radius, px, py, GAME.PLAYER_W, GAME.PLAYER_H)) {
        e.hit = true;

        if (player.invincible) {
          // Flash dodge — absorbed, no damage
          spawnParticles(entities, e.x, e.y, COLORS.flashGlow, 8);
          dispatch({ type: 'dodge-absorbed' });
        } else if (player.shielded) {
          // Shield absorbs
          player.shielded = false;
          player.shieldExpiry = 0;
          spawnParticles(entities, e.x, e.y, COLORS.shieldGlow, 10);
          dispatch({ type: 'shield-update', shielded: false });
          dispatch({ type: 'shield-absorbed' });
        } else {
          const newHp = Math.max(0, player.hp - e.damage);
          player.hp = newHp;
          spawnParticles(entities, e.x, e.y, COLORS.voidBoltGlow, 8);
          dispatch({ type: 'player-hit', playerHp: newHp, damage: e.damage });

          if (newHp <= 0) {
            entities.gameState.status = 'defeat';
            dispatch({ type: 'game-over', result: 'defeat' });
          }
        }

        toRemove.push(key);
        return;
      }
    }
  });

  // ── 4. Update zigzag beams (fade out) ────────────────────────────────────
  Object.keys(entities).forEach(key => {
    const e = entities[key];
    if (!e || e.renderer !== ZigzagRenderer) return;
    e.life -= time.delta;
    if (e.life <= 0) toRemove.push(key);
  });

  // ── 5. Update particles ───────────────────────────────────────────────────
  Object.keys(entities).forEach(key => {
    const e = entities[key];
    if (!e || e.renderer !== ParticleRenderer) return;
    e.x += e.vx;
    e.y += e.vy;
    e.vx *= 0.92;
    e.vy *= 0.92;
    e.life -= e.decay;
    if (e.life <= 0) toRemove.push(key);
  });

  // ── 5. Cleanup ────────────────────────────────────────────────────────────
  toRemove.forEach(k => delete entities[k]);

  return entities;
};

export default SpellSystem;
