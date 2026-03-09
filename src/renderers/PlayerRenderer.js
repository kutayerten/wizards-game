import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { GAME, COLORS } from '../constants/config';

const PlayerRenderer = ({
  body, size,
  shielded, invincible,
  playerEmoji, staffGlowColor,
}) => {
  const emoji = playerEmoji || '🧙';
  const glow  = staffGlowColor || COLORS.accentGlow;

  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  const shieldAnim = useRef(new Animated.Value(0)).current;
  const flashAnim  = useRef(new Animated.Value(1)).current;
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const glowAnim   = useRef(new Animated.Value(0.6)).current;

  // Floating motion
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 900, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 6,  duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Staff glow pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Shield pulse
  useEffect(() => {
    if (shielded) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shieldAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
          Animated.timing(shieldAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      shieldAnim.stopAnimation();
      shieldAnim.setValue(0);
    }
  }, [shielded]);

  // Flash blink
  useEffect(() => {
    if (invincible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
          Animated.timing(flashAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        ])
      ).start();
    } else {
      flashAnim.stopAnimation();
      flashAnim.setValue(1);
    }
  }, [invincible]);

  return (
    <Animated.View style={[styles.container, {
      left: x,
      top: y,
      width: size[0],
      height: size[1],
      opacity: flashAnim,
      transform: [{ translateY: floatAnim }],
    }]}>

      {/* Outer glow ring */}
      <Animated.View style={[styles.outerGlow, {
        borderColor: glow,
        shadowColor: glow,
        opacity: glowAnim,
      }]} />

      {/* Shield aura */}
      {shielded && (
        <Animated.View style={[styles.shieldAura, {
          borderColor: COLORS.shield,
          shadowColor: COLORS.shield,
          opacity: shieldAnim,
        }]} />
      )}

      {/* Staff glow bar */}
      <Animated.View style={[styles.staffGlow, {
        backgroundColor: glow,
        shadowColor: glow,
        opacity: glowAnim,
      }]} />

      {/* Character circle */}
      <View style={[styles.charWrap, { shadowColor: glow }]}>
        <Text style={styles.charEmoji}>{emoji}</Text>
      </View>

      {/* Name tag */}
      <View style={[styles.nameTag, { borderColor: glow + '88', backgroundColor: 'rgba(0,0,0,0.55)' }]}>
        <Text style={[styles.name, { color: glow }]}>Zephyr</Text>
      </View>

      {/* Platform shadow */}
      <View style={[styles.platform, { backgroundColor: glow + '22', borderColor: glow + '44' }]} />
    </Animated.View>
  );
};

const W = GAME.PLAYER_W;
const H = GAME.PLAYER_H;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  outerGlow: {
    position: 'absolute',
    left: -20, top: -20,
    width: W + 40, height: H + 40,
    borderRadius: (W + 40) / 2,
    borderWidth: 1,
  },
  shieldAura: {
    position: 'absolute',
    left: -14, top: -14,
    width: W + 28, height: H + 28,
    borderRadius: (W + 28) / 2,
    borderWidth: 3,
    backgroundColor: 'rgba(16,185,129,0.12)',
    shadowRadius: 12,
    shadowOpacity: 0.8,
    elevation: 8,
  },
  staffGlow: {
    width: 5,
    height: 26,
    borderRadius: 3,
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 8,
    marginBottom: 3,
  },
  charWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#27234a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 16,
    shadowOpacity: 1,
    elevation: 14,
    borderWidth: 2,
    borderColor: 'rgba(167,139,250,0.4)',
  },
  charEmoji: {
    fontSize: 44,
    textAlign: 'center',
  },
  nameTag: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
  },
  name: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  platform: {
    width: 50,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    marginTop: 3,
  },
});

export default PlayerRenderer;
