import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { GAME, COLORS } from '../constants/config';

const BossRenderer = ({ body, size, hp, maxHp, phase, enraged, monster }) => {
  const isBoss = monster?.isBoss ?? false;
  const emoji = monster?.emoji ?? '🐉';
  const haloColor = monster?.haloColor ?? COLORS.darkWave;
  const bgColor = monster?.bgColor ?? 'rgba(124,58,237,0.1)';

  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const enrageAnim = useRef(new Animated.Value(0)).current;
  const bossGlowAnim = useRef(new Animated.Value(0.5)).current;

  // Float pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.95, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Boss level özel parlama
  useEffect(() => {
    if (isBoss) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bossGlowAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(bossGlowAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isBoss]);

  // Phase 2 enrage
  useEffect(() => {
    if (enraged) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(enrageAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(enrageAnim, { toValue: 0.2, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    } else {
      enrageAnim.stopAnimation();
      enrageAnim.setValue(0);
    }
  }, [enraged]);

  const enrageOpacity = enrageAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] });
  const bossGlowOpacity = bossGlowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.5] });

  // Boss seviyelerde emoji daha büyük
  const emojiSize = isBoss ? 80 : 62;
  const containerSize = isBoss ? size[0] + 20 : size[0];

  return (
    <Animated.View
      style={[styles.container, {
        left: x - (isBoss ? 10 : 0),
        top: y,
        width: containerSize,
        height: size[1],
        transform: [{ scale: pulseAnim }],
      }]}
    >
      {/* Arka plan parlaması */}
      <Animated.View style={[styles.bgGlow, {
        backgroundColor: bgColor,
        borderColor: haloColor,
        opacity: isBoss ? bossGlowOpacity : 0.4,
      }]} />

      {/* Enrage kırmızı aura */}
      {enraged && (
        <Animated.View style={[styles.enrageAura, { opacity: enrageOpacity }]} />
      )}

      {/* Halo çemberi */}
      <View style={[styles.halo, { borderColor: enraged ? COLORS.enrageBeam : haloColor }]} />

      {/* Monster emoji */}
      <View style={styles.emojiWrap}>
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>{emoji}</Text>
      </View>

      {/* Phase 2 etiketi */}
      {phase === 2 && (
        <View style={[styles.phaseTag, { borderColor: COLORS.enrageBeam }]}>
          <Text style={styles.phaseText}>⚡ ÖFKE</Text>
        </View>
      )}

      {/* Boss seviye crown */}
      {isBoss && phase === 1 && (
        <Animated.View style={[styles.bossTag, { opacity: bossGlowAnim }]}>
          <Text style={styles.bossTagText}>👑 BOSS</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGlow: {
    position: 'absolute',
    left: -16,
    top: -16,
    right: -16,
    bottom: -16,
    borderRadius: 70,
    borderWidth: 2,
  },
  enrageAura: {
    position: 'absolute',
    left: -20,
    top: -20,
    right: -20,
    bottom: -20,
    borderRadius: 72,
    backgroundColor: '#ef4444',
  },
  halo: {
    position: 'absolute',
    left: -8,
    top: -8,
    right: -8,
    bottom: -8,
    borderRadius: 60,
    borderWidth: 2,
    opacity: 0.7,
  },
  emojiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  phaseTag: {
    position: 'absolute',
    bottom: -22,
    backgroundColor: 'rgba(239,68,68,0.25)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  phaseText: {
    color: COLORS.enrageBeam,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bossTag: {
    position: 'absolute',
    bottom: -22,
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  bossTagText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default BossRenderer;
