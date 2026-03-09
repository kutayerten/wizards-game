import React from 'react';
import { View } from 'react-native';

// ─── Fire Spell ───────────────────────────────────────────────────────────────
const FireSpell = ({ x, y, size }) => {
  const r = size / 2;
  return (
    <View style={{ position: 'absolute', left: x - r, top: y - r, width: size, height: size }}>
      {/* Wide outer glow */}
      <View style={{
        position: 'absolute', left: -14, top: -14,
        width: size + 28, height: size + 28,
        borderRadius: (size + 28) / 2,
        backgroundColor: '#f97316', opacity: 0.18,
      }} />
      {/* Flame petals at 0°, 120°, 240° */}
      {[0, 120, 240].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = r * 0.72;
        const pw = size * 0.30, ph = size * 0.50;
        return (
          <View key={i} style={{
            position: 'absolute',
            width: pw, height: ph,
            borderRadius: pw / 2,
            backgroundColor: '#fb923c',
            left: r - pw / 2 + Math.cos(rad) * dist,
            top:  r - ph / 2 + Math.sin(rad) * dist,
            transform: [{ rotate: `${deg}deg` }],
            opacity: 0.88,
          }} />
        );
      })}
      {/* Core */}
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: r, backgroundColor: '#ef4444',
        shadowColor: '#f97316', shadowRadius: 12, shadowOpacity: 1, elevation: 14,
      }} />
      {/* Hot yellow center */}
      <View style={{
        position: 'absolute',
        width: size * 0.52, height: size * 0.52,
        borderRadius: size * 0.26,
        backgroundColor: '#fef08a',
        left: size * 0.24, top: size * 0.24,
      }} />
      {/* White-hot tip */}
      <View style={{
        position: 'absolute',
        width: size * 0.24, height: size * 0.24,
        borderRadius: size * 0.12,
        backgroundColor: '#ffffff',
        left: size * 0.38, top: size * 0.38,
        opacity: 0.9,
      }} />
    </View>
  );
};

// ─── Lightning Spell ─────────────────────────────────────────────────────────
const LightningSpell = ({ x, y, size }) => {
  const r = size / 2;
  return (
    <View style={{ position: 'absolute', left: x - r, top: y - r, width: size, height: size }}>
      {/* Wide outer glow */}
      <View style={{
        position: 'absolute', left: -16, top: -16,
        width: size + 32, height: size + 32,
        borderRadius: (size + 32) / 2,
        backgroundColor: '#fbbf24', opacity: 0.15,
      }} />
      {/* Spike rays — 4 thin bars at 0°/45°/90°/135° */}
      {[0, 45, 90, 135].map((deg, i) => (
        <View key={i} style={{
          position: 'absolute',
          width: 3, height: size * 1.7,
          backgroundColor: '#fde68a',
          left: r - 1.5, top: r - size * 0.85,
          transform: [{ rotate: `${deg}deg` }],
          borderRadius: 2, opacity: 0.92,
          shadowColor: '#fbbf24', shadowRadius: 4, shadowOpacity: 1,
        }} />
      ))}
      {/* Core */}
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: r, backgroundColor: '#fbbf24',
        shadowColor: '#fef08a', shadowRadius: 12, shadowOpacity: 1, elevation: 14,
      }} />
      {/* Bright inner */}
      <View style={{
        position: 'absolute',
        width: size * 0.5, height: size * 0.5,
        borderRadius: size * 0.25,
        backgroundColor: '#ffffff',
        left: size * 0.25, top: size * 0.25, opacity: 0.95,
      }} />
    </View>
  );
};

// ─── Cold Spell ───────────────────────────────────────────────────────────────
const ColdSpell = ({ x, y, size }) => {
  const r = size / 2;
  return (
    <View style={{ position: 'absolute', left: x - r, top: y - r, width: size, height: size }}>
      {/* Wide outer glow */}
      <View style={{
        position: 'absolute', left: -14, top: -14,
        width: size + 28, height: size + 28,
        borderRadius: (size + 28) / 2,
        backgroundColor: '#7dd3fc', opacity: 0.20,
      }} />
      {/* Ice crystal spikes at 0°/90°/180°/270° */}
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = r * 0.74;
        const cs = size * 0.34;
        return (
          <View key={i} style={{
            position: 'absolute',
            width: cs, height: cs,
            backgroundColor: '#bae6fd',
            left: r - cs / 2 + Math.cos(rad) * dist,
            top:  r - cs / 2 + Math.sin(rad) * dist,
            transform: [{ rotate: '45deg' }],
            opacity: 0.92,
            shadowColor: '#7dd3fc', shadowRadius: 4, shadowOpacity: 0.8,
          }} />
        );
      })}
      {/* Diagonal crystals at 45°/135°/225°/315° — smaller */}
      {[45, 135, 225, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = r * 0.58;
        const cs = size * 0.22;
        return (
          <View key={i} style={{
            position: 'absolute',
            width: cs, height: cs,
            backgroundColor: '#e0f2fe',
            left: r - cs / 2 + Math.cos(rad) * dist,
            top:  r - cs / 2 + Math.sin(rad) * dist,
            transform: [{ rotate: '45deg' }],
            opacity: 0.80,
          }} />
        );
      })}
      {/* Core */}
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: r, backgroundColor: '#0ea5e9',
        shadowColor: '#7dd3fc', shadowRadius: 12, shadowOpacity: 1, elevation: 14,
      }} />
      {/* Inner bright */}
      <View style={{
        position: 'absolute',
        width: size * 0.46, height: size * 0.46,
        borderRadius: size * 0.23,
        backgroundColor: '#e0f2fe',
        left: size * 0.27, top: size * 0.27,
      }} />
    </View>
  );
};

// ─── Arcane Spell (default) ───────────────────────────────────────────────────
const ArcaneSpell = ({ x, y, size, color, glowColor }) => {
  const r = size / 2;
  return (
    <View style={{ position: 'absolute', left: x - r, top: y - r, width: size, height: size }}>
      <View style={{
        position: 'absolute', left: -6, top: -6,
        width: size + 12, height: size + 12,
        borderRadius: (size + 12) / 2,
        backgroundColor: glowColor || color, opacity: 0.20,
      }} />
      <View style={{
        position: 'absolute', width: size, height: size,
        borderRadius: r, backgroundColor: color,
        shadowColor: glowColor || color, shadowRadius: 8, shadowOpacity: 1, elevation: 10,
      }} />
      <View style={{
        position: 'absolute',
        width: size * 0.5, height: size * 0.5,
        borderRadius: size * 0.25,
        backgroundColor: 'rgba(255,255,255,0.7)',
        left: size * 0.25, top: size * 0.25,
      }} />
    </View>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
const SpellRenderer = ({ x, y, radius, color, glowColor, element }) => {
  const size = radius * 2;
  if (element === 'fire')      return <FireSpell      x={x} y={y} size={size} />;
  if (element === 'lightning') return <LightningSpell x={x} y={y} size={size} />;
  if (element === 'cold')      return <ColdSpell      x={x} y={y} size={size} />;
  return <ArcaneSpell x={x} y={y} size={size} color={color} glowColor={glowColor} />;
};

export default SpellRenderer;
