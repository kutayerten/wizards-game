import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';

import setupEntities from '../entities';
import SpellSystem from '../systems/SpellSystem';
import EnemyAISystem from '../systems/EnemyAISystem';
import ManaSystem from '../systems/ManaSystem';
import HUD from '../components/HUD';
import { GAME, COLORS } from '../constants/config';
import { PLAYER_SPELLS } from '../constants/spells';
import { getMonsterForLevel, getBossHp, MAX_LEVEL } from '../constants/monsters';
import { getGoldReward } from '../constants/items';

const SYSTEMS = [SpellSystem, EnemyAISystem, ManaSystem];

const GameScreen = ({
  bossLevel, playerLevel, gold,
  equippedBonuses,
  onVictory, onRestart, onOpenInventory, onExit,
}) => {
  const engineRef = useRef(null);

  // entitiesRef is the single source of truth for the engine.
  // It is updated synchronously in handleContinue/handleRetry BEFORE
  // setGameKey triggers the re-render, so GameEngine always mounts
  // with the correct entities.
  const entitiesRef = useRef(
    setupEntities({ bossLevel, playerLevel, equippedBonuses })
  );

  // Incrementing gameKey forces GameEngine to fully unmount + remount,
  // picking up the fresh entitiesRef.current.
  const [gameKey, setGameKey] = useState(0);

  // ── HUD ───────────────────────────────────────────────────────────────────
  const makeHud = (bl, pl) => ({
    bossHp:       getBossHp(bl),
    maxBossHp:    getBossHp(bl),
    bossPhase:    1,
    bossLevel:    bl,
    playerHp:     GAME.PLAYER_MAX_HP + (pl - 1) * 80 + (equippedBonuses?.maxHpBonus ?? 0),
    maxPlayerHp:  GAME.PLAYER_MAX_HP + (pl - 1) * 80 + (equippedBonuses?.maxHpBonus ?? 0),
    playerMana:    GAME.PLAYER_MAX_MANA,
    maxPlayerMana: GAME.PLAYER_MAX_MANA,
    playerLevel:  pl,
    shielded:     false,
    invincible:   false,
    cooldowns:    Object.fromEntries(PLAYER_SPELLS.map(s => [s.id, 0])),
  });

  const [hudData, setHudData]       = useState(() => makeHud(bossLevel, playerLevel));
  const [gameResult, setGameResult]  = useState(null);
  const [goldEarned, setGoldEarned]  = useState(0);

  const levelUpAnim = useRef(new Animated.Value(0)).current;
  const [dmgPopup, setDmgPopup]     = useState(null);
  const dmgAnim = useRef(new Animated.Value(0)).current;

  // Cooldown tick
  useEffect(() => {
    const id = setInterval(() => setHudData(p => ({ ...p })), 100);
    return () => clearInterval(id);
  }, []);

  // ── Events ────────────────────────────────────────────────────────────────
  const handleEvent = useCallback((e) => {
    switch (e.type) {
      case 'boss-hit':
        setHudData(p => ({ ...p, bossHp: e.bossHp }));
        showDmg(`-${e.damage}`, COLORS.cannon);
        break;
      case 'player-hit':
        setHudData(p => ({ ...p, playerHp: e.playerHp }));
        showDmg(`-${e.damage}`, COLORS.health);
        break;
      case 'mana-update':
        setHudData(p => ({ ...p, playerMana: Math.ceil(e.mana) }));
        break;
      case 'cooldown-update':
        setHudData(p => ({ ...p, cooldowns: { ...e.cooldowns } }));
        break;
      case 'boss-phase2':
        setHudData(p => ({ ...p, bossPhase: 2 }));
        break;
      case 'shield-update':
        setHudData(p => ({ ...p, shielded: e.shielded }));
        break;
      case 'flash-update':
        setHudData(p => ({ ...p, invincible: e.invincible }));
        break;
      case 'shield-absorbed':
        showDmg('BLOKE!', COLORS.shield); break;
      case 'dodge-absorbed':
        showDmg('KAÇINDI!', COLORS.flash); break;
      case 'game-over': {
        const reward = e.result === 'victory' ? getGoldReward(bossLevel) : 0;
        setGoldEarned(reward);
        if (e.result === 'victory' && bossLevel >= MAX_LEVEL) {
          setGameResult('complete');
          onVictory(reward, bossLevel + 1, playerLevel + 1);
        } else {
          setGameResult(e.result);
          // onVictory is called from handleContinue, not here,
          // so the victory overlay renders before any prop changes.
        }
        if (e.result === 'victory') {
          levelUpAnim.setValue(1);
          Animated.timing(levelUpAnim, { toValue: 0, duration: 1400, useNativeDriver: true }).start();
        }
        break;
      }
      default: break;
    }
  }, [bossLevel, playerLevel]);

  const showDmg = (text, color) => {
    setDmgPopup({ text, color });
    dmgAnim.setValue(0);
    Animated.sequence([
      Animated.timing(dmgAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(dmgAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setDmgPopup(null));
  };

  const handleSpellCast = useCallback((spellId) => {
    if (!entitiesRef.current) return;
    entitiesRef.current.playerInput.pendingSpell = spellId;
  }, []);

  // ── Devam / Retry ─────────────────────────────────────────────────────────
  const handleContinue = () => {
    const nextBoss   = bossLevel + 1;
    const nextPlayer = playerLevel + 1;
    // Update ref synchronously — React reads it when GameEngine remounts.
    entitiesRef.current = setupEntities({ bossLevel: nextBoss, playerLevel: nextPlayer, equippedBonuses });
    setHudData(makeHud(nextBoss, nextPlayer));
    setGameResult(null);
    setGameKey(k => k + 1);
    onVictory(goldEarned, nextBoss, nextPlayer);
  };

  const handleRetry = () => {
    entitiesRef.current = setupEntities({ bossLevel, playerLevel, equippedBonuses });
    setHudData(makeHud(bossLevel, playerLevel));
    setGameResult(null);
    setGameKey(k => k + 1);
    onRestart(bossLevel, playerLevel);
  };

  const monster     = getMonsterForLevel(bossLevel);
  const nextMonster = bossLevel < MAX_LEVEL ? getMonsterForLevel(bossLevel + 1) : null;

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <GameEngine
        key={gameKey}
        ref={engineRef}
        style={StyleSheet.absoluteFill}
        systems={SYSTEMS}
        entities={entitiesRef.current}
        onEvent={handleEvent}
        running={gameResult === null}
      />

      <HUD
        bossHp={hudData.bossHp}       maxBossHp={hudData.maxBossHp}
        bossPhase={hudData.bossPhase} bossLevel={hudData.bossLevel}
        playerHp={hudData.playerHp}   maxPlayerHp={hudData.maxPlayerHp}
        playerMana={hudData.playerMana} maxPlayerMana={hudData.maxPlayerMana}
        playerLevel={hudData.playerLevel}
        gold={gold}
        shielded={hudData.shielded}   invincible={hudData.invincible}
        cooldowns={hudData.cooldowns}
        extraSpellId={equippedBonuses?.extraSpellId ?? null}
        onCast={handleSpellCast}
        onOpenInventory={onOpenInventory}
      />

      {/* Hasar popup */}
      {dmgPopup && (
        <Animated.View style={[styles.dmgPopup, {
          opacity: dmgAnim,
          transform: [{ translateY: dmgAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) }],
        }]} pointerEvents="none">
          <Text style={[styles.dmgText, { color: dmgPopup.color }]}>{dmgPopup.text}</Text>
        </Animated.View>
      )}

      {/* Level-up flash */}
      <Animated.View style={[styles.flash, { opacity: levelUpAnim }]} pointerEvents="none" />

      {/* ─── ZAFERSİN ─── */}
      {gameResult === 'victory' && (
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: monster?.isBoss ? COLORS.gold : COLORS.accentGlow }]}>
            <Text style={styles.cardEmoji}>{monster?.isBoss ? '🏆' : '✅'}</Text>
            <Text style={[styles.cardTitle, { color: monster?.isBoss ? COLORS.gold : COLORS.accentGlow }]}>
              {monster?.isBoss ? 'BOSS YENİLDİ!' : 'ZAFERSİN!'}
            </Text>
            <Text style={styles.cardSub}>{monster?.emoji} {monster?.name} öldürüldü!</Text>

            <View style={styles.goldRewardBox}>
              <Text style={styles.goldRewardText}>💰 +{goldEarned.toLocaleString()} altın kazandın!</Text>
            </View>

            {nextMonster && (
              <View style={styles.levelBox}>
                <Text style={styles.levelBoxTitle}>SIRADAY DÜŞMAN</Text>
                <Text style={styles.nextMonsterText}>
                  {nextMonster.emoji}  {nextMonster.name}
                  {nextMonster.isBoss ? '  👑 BOSS!' : ''}
                </Text>
                {nextMonster.isBoss && (
                  <View style={styles.bossWarn}>
                    <Text style={styles.bossWarnText}>⚠ Sıradaki seviye çok zor olacak! Envantere bak.</Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.primaryBtn} onPress={() => onOpenInventory('staff')}>
              <Text style={styles.primaryBtnText}>🎒 Envanter Aç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#1c3a1c', marginTop: 0 }]} onPress={handleContinue}>
              <Text style={styles.primaryBtnText}>▶ Devam Et — Lv {bossLevel + 1}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onExit}>
              <Text style={styles.secondaryBtnText}>↩ Ana Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─── YENİLDİN ─── */}
      {gameResult === 'defeat' && (
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: COLORS.health }]}>
            <Text style={styles.cardEmoji}>💀</Text>
            <Text style={[styles.cardTitle, { color: COLORS.health }]}>YENİLDİN</Text>
            <Text style={styles.cardSub}>{monster?.emoji} {monster?.name} seni devirdi.</Text>
            <View style={styles.levelBox}>
              <Text style={styles.levelBoxTitle}>İPUCU</Text>
              <Text style={styles.hintText}>💡 Envantere giderek güçlü itemlar satın alabilirsin!</Text>
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onOpenInventory('staff')}>
              <Text style={styles.primaryBtnText}>🎒 Envanter Aç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#7f1d1d' }]} onPress={handleRetry}>
              <Text style={styles.primaryBtnText}>↺ Tekrar Dene</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onExit}>
              <Text style={styles.secondaryBtnText}>↩ Ana Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─── OYUN TAMAMLANDI ─── */}
      {gameResult === 'complete' && (
        <View style={styles.overlay}>
          <View style={[styles.card, { borderColor: COLORS.gold, borderWidth: 3 }]}>
            <Text style={[styles.cardEmoji, { fontSize: 72 }]}>🌌</Text>
            <Text style={[styles.cardTitle, { color: COLORS.gold }]}>OYUN TAMAMLANDI!</Text>
            <Text style={styles.cardSub}>
              Tüm {MAX_LEVEL} seviyeyi geçtin!{'\n'}Boşluk Tanrısı yenildi!
            </Text>
            <View style={styles.goldRewardBox}>
              <Text style={styles.goldRewardText}>💰 +{goldEarned.toLocaleString()} altın!</Text>
            </View>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: COLORS.gold }]} onPress={onExit}>
              <Text style={[styles.primaryBtnText, { color: '#1c1836' }]}>🏠 Ana Menüye Dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  dmgPopup: { position: 'absolute', alignSelf: 'center', top: '45%' },
  dmgText: {
    fontSize: 28, fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 2 },
  },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.gold },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,10,28,0.88)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1c1836', borderRadius: 20, borderWidth: 2,
    padding: 22, alignItems: 'center', width: '88%',
    shadowColor: '#000', shadowRadius: 24, shadowOpacity: 0.8, elevation: 16,
    gap: 10,
  },
  cardEmoji: { fontSize: 56 },
  cardTitle: { fontSize: 26, fontWeight: '900', letterSpacing: 2 },
  cardSub:   { color: COLORS.textDim, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  goldRewardBox: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 10, borderWidth: 1, borderColor: COLORS.gold,
    paddingHorizontal: 18, paddingVertical: 8, width: '100%', alignItems: 'center',
  },
  goldRewardText: { color: COLORS.gold, fontSize: 16, fontWeight: '900' },

  levelBox: {
    width: '100%', backgroundColor: 'rgba(55,19,236,0.1)',
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    padding: 12,
  },
  levelBoxTitle: { color: COLORS.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  nextMonsterText: { color: COLORS.white, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  bossWarn: {
    backgroundColor: 'rgba(245,158,11,0.12)', borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.gold, padding: 7, marginTop: 6,
  },
  bossWarnText: { color: COLORS.gold, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  hintText: { color: COLORS.textDim, fontSize: 12, textAlign: 'center', lineHeight: 18 },

  primaryBtn: {
    backgroundColor: COLORS.accent, borderRadius: 12,
    paddingVertical: 13, width: '100%', alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  secondaryBtn: {
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 10, width: '100%', alignItems: 'center',
  },
  secondaryBtnText: { color: COLORS.textDim, fontSize: 13, fontWeight: '600' },
});

export default GameScreen;
