import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SCREEN_W, SCREEN_H, COLORS } from '../constants/config';

// Generate static starfield positions once
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      r: 0.5 + Math.random() * 1.8,
      color: [COLORS.star1, COLORS.star2, COLORS.star3][Math.floor(Math.random() * 3)],
      opacity: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

const STARS = generateStars(80);

// Floating energy orbs
const ORBS = [
  { x: SCREEN_W * 0.15, y: SCREEN_H * 0.3, r: 60, color: '#3713ec', opacity: 0.06 },
  { x: SCREEN_W * 0.85, y: SCREEN_H * 0.5, r: 80, color: '#7c5cfc', opacity: 0.05 },
  { x: SCREEN_W * 0.5, y: SCREEN_H * 0.7, r: 100, color: '#06b6d4', opacity: 0.04 },
];

const BackgroundRenderer = () => (
  <View style={styles.bg} pointerEvents="none">
    {/* Gradient-like layers */}
    <View style={styles.topGrad} />
    <View style={styles.bottomGrad} />

    {/* Energy orbs */}
    {ORBS.map((o, i) => (
      <View
        key={`orb_${i}`}
        style={[styles.orb, {
          left: o.x - o.r,
          top: o.y - o.r,
          width: o.r * 2,
          height: o.r * 2,
          borderRadius: o.r,
          backgroundColor: o.color,
          opacity: o.opacity,
        }]}
      />
    ))}

    {/* Arena floor line */}
    <View style={styles.arenaLine} />

    {/* Stars */}
    {STARS.map((s, i) => (
      <View
        key={`star_${i}`}
        style={[styles.star, {
          left: s.x,
          top: s.y,
          width: s.r * 2,
          height: s.r * 2,
          borderRadius: s.r,
          backgroundColor: s.color,
          opacity: s.opacity,
        }]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
  },
  topGrad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.45,
    backgroundColor: '#1a0d3a',
    opacity: 0.5,
  },
  bottomGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_H * 0.4,
    backgroundColor: '#0d0d22',
    opacity: 0.6,
  },
  arenaLine: {
    position: 'absolute',
    top: SCREEN_H * 0.5,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#2e2860',
    opacity: 0.6,
  },
  star: {
    position: 'absolute',
  },
  orb: {
    position: 'absolute',
  },
});

export default BackgroundRenderer;
