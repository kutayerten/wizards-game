import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { COLORS, GAME } from '../constants/config';
import { PLAYER_SPELLS, EXTRA_SPELLS } from '../constants/spells';
import { getMonsterForLevel, MAX_LEVEL } from '../constants/monsters';

const { width: W } = Dimensions.get('window');

// ─── Bar Component ────────────────────────────────────────────────────────────

const Bar = ({ value, max, color, bgColor, height = 10 }) => {
  const fillAnim = useRef(new Animated.Value(value / max)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: Math.max(0, value / max),
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, max]);

  const width = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.barBg, { height, backgroundColor: bgColor }]}>
      <Animated.View style={[styles.barFill, { width, backgroundColor: color }]} />
    </View>
  );
};

// ─── Boss Header ──────────────────────────────────────────────────────────────

const BossHeader = ({ bossHp, maxBossHp, bossPhase, bossLevel }) => {
  const fraction = bossHp / maxBossHp;
  const monster = getMonsterForLevel(bossLevel);
  const isBoss = monster.isBoss;
  const hpColor = fraction > 0.5
    ? (isBoss ? '#f97316' : COLORS.health)
    : bossPhase === 2 ? COLORS.enrageBeam : COLORS.healthMid;

  const levelLabel = bossPhase === 2
    ? '⚡ ÖFKE'
    : isBoss
      ? (monster.bossTitle || '👑 BOSS')
      : `Lv ${bossLevel}`;

  const levelColor = bossPhase === 2
    ? COLORS.enrageBeam
    : isBoss ? COLORS.gold : COLORS.textDim;

  return (
    <View style={[styles.bossHeader, isBoss && { borderBottomColor: COLORS.gold }]}>
      <View style={styles.bossNameRow}>
        <Text style={[styles.bossTitle, isBoss && { color: COLORS.gold }]}>
          {monster.emoji}  {monster.name}
        </Text>
        <Text style={[styles.bossLevel, { color: levelColor }]}>
          {levelLabel}
        </Text>
      </View>

      <View style={styles.bossHpRow}>
        <Bar
          value={bossHp}
          max={maxBossHp}
          color={hpColor}
          bgColor={COLORS.healthDark}
          height={12}
        />
        <Text style={styles.bossHpText}>
          {Math.ceil(bossHp).toLocaleString()} / {maxBossHp.toLocaleString()} HP
          {isBoss && '  👑'}
        </Text>
      </View>

      {/* İlerleme çubuğu */}
      <Text style={styles.progressText}>
        Level {bossLevel} / {MAX_LEVEL}
        {bossLevel === MAX_LEVEL ? '  🏆 SON LEVEL' : ''}
      </Text>
    </View>
  );
};

// ─── Player Status ────────────────────────────────────────────────────────────

const PlayerStatus = ({ playerHp, maxPlayerHp, playerMana, maxPlayerMana, shielded, invincible, playerLevel, gold, onOpenInventory }) => (
  <View style={styles.playerStatus}>
    <View style={styles.statusRow}>
      <Text style={styles.playerName}>⚡ Archmage Zephyr</Text>
      <View style={styles.statusRowRight}>
        <Text style={styles.playerLevel}>Lv {playerLevel}</Text>
        <TouchableOpacity style={styles.goldBadge} onPress={onOpenInventory}>
          <Text style={styles.goldText}>💰 {(gold || 0).toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.barRow}>
      <Text style={styles.barLabel}>HP</Text>
      <View style={styles.barWrapper}>
        <Bar value={playerHp} max={maxPlayerHp} color={COLORS.health} bgColor={COLORS.healthDark} height={8} />
      </View>
      <Text style={styles.barValue}>{Math.ceil(playerHp)}</Text>
    </View>

    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: COLORS.mana }]}>MP</Text>
      <View style={styles.barWrapper}>
        <Bar value={playerMana} max={maxPlayerMana} color={COLORS.mana} bgColor={COLORS.manaDark} height={8} />
      </View>
      <Text style={[styles.barValue, { color: COLORS.mana }]}>{Math.ceil(playerMana)}</Text>
    </View>

    {/* Status effects */}
    <View style={styles.statusEffects}>
      {shielded && <View style={[styles.statusPill, { borderColor: COLORS.shield }]}>
        <Text style={[styles.statusPillText, { color: COLORS.shield }]}>🛡 Shield</Text>
      </View>}
      {invincible && <View style={[styles.statusPill, { borderColor: COLORS.flash }]}>
        <Text style={[styles.statusPillText, { color: COLORS.flash }]}>✨ Flash</Text>
      </View>}
    </View>
  </View>
);

// ─── Spell Button ─────────────────────────────────────────────────────────────

const SpellButton = ({ spell, cooldownExpiry, playerMana, onCast }) => {
  const now = Date.now();
  const remaining = Math.max(0, cooldownExpiry - now);
  const onCooldown = remaining > 0;
  const noMana = playerMana < spell.manaCost;
  const disabled = onCooldown || noMana;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onCast(spell.id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.8}
      style={styles.spellBtnWrapper}
    >
      <Animated.View
        style={[
          styles.spellBtn,
          { borderColor: disabled ? '#2e2860' : spell.color },
          disabled && styles.spellBtnDisabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Cooldown overlay */}
        {onCooldown && (
          <View style={styles.cooldownOverlay}>
            <Text style={styles.cooldownText}>{(remaining / 1000).toFixed(1)}</Text>
          </View>
        )}

        <Text style={styles.spellIcon}>{spell.icon}</Text>
        <Text style={styles.spellName} numberOfLines={1}>{spell.name}</Text>
        <Text style={[styles.spellMana, { color: noMana ? '#7f1d1d' : COLORS.mana }]}>
          {spell.manaCost}mp
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Spell Bar ────────────────────────────────────────────────────────────────

const SpellBar = ({ cooldowns, playerMana, onCast, extraSpellId }) => {
  const extraSpell = extraSpellId ? EXTRA_SPELLS.find(s => s.id === extraSpellId) : null;
  // Insert extra spell after index 1 (between Cannon and Shield)
  const spells = [
    PLAYER_SPELLS[0],
    PLAYER_SPELLS[1],
    ...(extraSpell ? [extraSpell] : []),
    PLAYER_SPELLS[2],
    PLAYER_SPELLS[3],
  ];
  return (
    <View style={styles.spellBar}>
      {spells.map(spell => (
        <SpellButton
          key={spell.id}
          spell={spell}
          cooldownExpiry={cooldowns[spell.id] || 0}
          playerMana={playerMana}
          onCast={onCast}
        />
      ))}
    </View>
  );
};

// ─── Nav Bar ──────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { icon: '🎒', label: 'Inventory' },
  { icon: '⚔️', label: 'Battle' },
  { icon: '🔮', label: 'Spells' },
  { icon: '🗺️', label: 'World' },
];

const NavBar = ({ activeTab = 1, onTabPress }) => (
  <View style={styles.navBar}>
    {NAV_TABS.map((tab, i) => (
      <TouchableOpacity
        key={tab.label}
        style={[styles.navTab, i === activeTab && styles.navTabActive]}
        onPress={() => onTabPress && onTabPress(i)}
        activeOpacity={0.7}
      >
        <Text style={styles.navIcon}>{tab.icon}</Text>
        <Text style={[styles.navLabel, i === activeTab && styles.navLabelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Main HUD Export ──────────────────────────────────────────────────────────

const HUD = ({
  bossHp, maxBossHp, bossPhase, bossLevel,
  playerHp, maxPlayerHp,
  playerMana, maxPlayerMana,
  playerLevel, gold,
  shielded, invincible,
  cooldowns,
  extraSpellId,
  onCast, onOpenInventory,
}) => (
  <View style={styles.hud} pointerEvents="box-none">
    <BossHeader bossHp={bossHp} maxBossHp={maxBossHp} bossPhase={bossPhase} bossLevel={bossLevel} />
    <View style={styles.flex1} pointerEvents="none" />
    <PlayerStatus
      playerHp={playerHp}
      maxPlayerHp={maxPlayerHp}
      playerMana={playerMana}
      maxPlayerMana={maxPlayerMana}
      playerLevel={playerLevel}
      gold={gold}
      shielded={shielded}
      invincible={invincible}
      onOpenInventory={onOpenInventory}
    />
    <SpellBar cooldowns={cooldowns} playerMana={playerMana} onCast={onCast} extraSpellId={extraSpellId} />
    <NavBar
      activeTab={1}
      onTabPress={(i) => {
        if (i === 0) onOpenInventory && onOpenInventory('staff');
        if (i === 2) onOpenInventory && onOpenInventory('spellpack');
      }}
    />
  </View>
);

export default HUD;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  flex1: { flex: 1 },

  // Boss header
  bossHeader: {
    backgroundColor: 'rgba(19, 16, 34, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  bossNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bossTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bossLevel: {
    fontSize: 12,
    fontWeight: '700',
  },
  bossHpRow: {
    gap: 4,
  },
  bossHpText: {
    color: COLORS.textDim,
    fontSize: 10,
    textAlign: 'right',
    marginTop: 2,
  },
  progressText: {
    color: COLORS.textDim,
    fontSize: 9,
    textAlign: 'right',
    marginTop: 1,
    letterSpacing: 0.3,
  },

  // Bars
  barBg: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: COLORS.healthDark,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },

  // Player status
  playerStatus: {
    backgroundColor: 'rgba(19, 16, 34, 0.88)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goldBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  goldText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  playerName: {
    color: COLORS.accentGlow,
    fontSize: 13,
    fontWeight: '700',
  },
  playerLevel: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  barLabel: {
    color: COLORS.health,
    fontSize: 11,
    fontWeight: '700',
    width: 22,
  },
  barWrapper: {
    flex: 1,
  },
  barValue: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    width: 38,
    textAlign: 'right',
  },
  statusEffects: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Spell bar
  spellBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(19, 16, 34, 0.92)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 6,
  },
  spellBtnWrapper: {
    flex: 1,
  },
  spellBtn: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 26, 56, 0.9)',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  spellBtnDisabled: {
    opacity: 0.55,
  },
  cooldownOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 8,
  },
  cooldownText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  spellIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  spellKey: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spellName: {
    color: COLORS.textDim,
    fontSize: 8,
    marginTop: 1,
    textAlign: 'center',
  },
  spellMana: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },

  // Nav bar
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13, 10, 28, 0.96)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 6,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  navTabActive: {
    borderTopColor: COLORS.accent,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    color: COLORS.textDim,
    fontSize: 10,
  },
  navLabelActive: {
    color: COLORS.accentGlow,
    fontWeight: '700',
  },
});
