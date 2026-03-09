import React from 'react';
import { View } from 'react-native';

const ParticleRenderer = ({ x, y, radius, color, life }) => {
  const size = radius * 2 * life; // shrink as life decays

  return (
    <View
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: life * 0.9,
        shadowColor: color,
        shadowRadius: size,
        shadowOpacity: life,
        elevation: 4,
      }}
    />
  );
};

export default ParticleRenderer;
