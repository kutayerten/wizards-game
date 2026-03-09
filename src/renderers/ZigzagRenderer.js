import React from 'react';
import { View } from 'react-native';

const ZigzagRenderer = ({ x1, y1, x2, y2, color, glowColor, life, maxLife, zigzagOffsets }) => {
  const alpha = maxLife > 0 ? Math.max(0, life / maxLife) : 1;
  if (alpha <= 0) return null;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;

  // Perpendicular unit vector for zigzag deviation
  const perpX = -dy / len;
  const perpY =  dx / len;

  // Build zigzag points using pre-generated offsets
  const offsets = zigzagOffsets || [];
  const pts = [{ x: x1, y: y1 }];
  for (let i = 0; i < offsets.length; i++) {
    const t = (i + 1) / (offsets.length + 1);
    pts.push({
      x: x1 + dx * t + perpX * offsets[i],
      y: y1 + dy * t + perpY * offsets[i],
    });
  }
  pts.push({ x: x2, y: y2 });

  return (
    <View
      style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
    >
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        const sdx = q.x - p.x;
        const sdy = q.y - p.y;
        const slen = Math.sqrt(sdx * sdx + sdy * sdy);
        if (slen < 1) return null;
        const angle = Math.atan2(sdy, sdx) * 180 / Math.PI;
        const cx = (p.x + q.x) / 2;
        const cy = (p.y + q.y) / 2;

        return (
          <React.Fragment key={i}>
            {/* Wide glow */}
            <View style={{
              position: 'absolute',
              left: cx - slen / 2,
              top: cy - 7,
              width: slen,
              height: 14,
              backgroundColor: glowColor || '#a5f3fc',
              transform: [{ rotate: `${angle}deg` }],
              borderRadius: 7,
              opacity: alpha * 0.28,
            }} />
            {/* Main beam line */}
            <View style={{
              position: 'absolute',
              left: cx - slen / 2,
              top: cy - 2,
              width: slen,
              height: 4,
              backgroundColor: color || '#22d3ee',
              transform: [{ rotate: `${angle}deg` }],
              borderRadius: 2,
              opacity: alpha * 0.95,
              shadowColor: color || '#22d3ee',
              shadowRadius: 5,
              shadowOpacity: 0.9,
              elevation: 8,
            }} />
            {/* Bright core line */}
            <View style={{
              position: 'absolute',
              left: cx - slen / 2,
              top: cy - 1,
              width: slen,
              height: 2,
              backgroundColor: '#ffffff',
              transform: [{ rotate: `${angle}deg` }],
              borderRadius: 1,
              opacity: alpha * 0.7,
            }} />
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default ZigzagRenderer;
