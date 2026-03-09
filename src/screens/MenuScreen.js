import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar,
} from 'react-native';
import { SCREEN_W, SCREEN_H, COLORS } from '../constants/config';
import { PLAYER_SPELLS } from '../constants/spells';

const MenuScreen = ({ onStart }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(titleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(btnAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* Background stars (simple dots) */}
      {Array.from({ length: 50 }).map((_, i) => (
        <View key={i} style={[styles.star, {
          left: Math.random() * SCREEN_W,
          top: Math.random() * SCREEN_H,
          width: 1 + Math.random() * 2,
          height: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.7,
        }]} />
      ))}

      {/* Dragon silhouette */}
      <Animated.View style={[styles.dragonArea, { opacity: titleAnim }]}>
        <Animated.Text style={[styles.dragon, {
          textShadowColor: COLORS.darkWave,
          opacity: glowAnim,
        }]}>
          🐉
        </Animated.Text>
        <View style={styles.vsLine} />
        <Animated.Text style={[styles.wizard, {
          textShadowColor: COLORS.accentGlow,
          opacity: glowAnim,
        }]}>
          🧙
        </Animated.Text>
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleArea, {
        opacity: titleAnim,
        transform: [{
          translateY: titleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          }),
        }],
      }]}>
        <Text style={styles.subtitle}>Ancient Void Dragon</Text>
        <Text style={styles.title}>WIZARDS</Text>
        <Text style={styles.subtitle2}>Spell-Casting Battle</Text>
      </Animated.View>

      {/* Spell preview */}
      <View style={styles.spellPreview}>
        {PLAYER_SPELLS.map(s => (
          <View key={s.id} style={[styles.spellChip, { borderColor: s.color }]}>
            <Text style={styles.spellChipIcon}>{s.icon}</Text>
            <Text style={[styles.spellChipKey, { color: s.color }]}>{s.key}</Text>
          </View>
        ))}
      </View>

      {/* Start button */}
      <Animated.View style={{ opacity: btnAnim, width: '75%' }}>
        <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.85}>
          <Animated.Text style={[styles.startBtnText, { opacity: glowAnim }]}>
            ⚔ ENTER BATTLE
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Version */}
      <Text style={styles.version}>v1.0 — Archmage Zephyr vs Lv.50 Boss</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 24,
  },
  star: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  dragonArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
  },
  dragon: {
    fontSize: 72,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  vsLine: {
    width: 2,
    height: 60,
    backgroundColor: COLORS.border,
  },
  wizard: {
    fontSize: 64,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  titleArea: {
    alignItems: 'center',
  },
  subtitle: {
    color: COLORS.darkWaveGlow,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: COLORS.white,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 8,
    textShadowColor: COLORS.accent,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle2: {
    color: COLORS.textDim,
    fontSize: 13,
    letterSpacing: 2,
    marginTop: 4,
  },
  spellPreview: {
    flexDirection: 'row',
    gap: 10,
  },
  spellChip: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 26, 56, 0.8)',
    minWidth: 52,
  },
  spellChipIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  spellChipKey: {
    fontSize: 11,
    fontWeight: '800',
  },
  startBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.accentLight,
    shadowRadius: 16,
    shadowOpacity: 0.7,
    elevation: 12,
  },
  startBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  version: {
    color: COLORS.textDim,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});

export default MenuScreen;
