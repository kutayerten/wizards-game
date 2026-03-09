import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export const SCREEN_W = W;
export const SCREEN_H = H;

export const COLORS = {
  bg: '#131022',
  bgMid: '#1c1836',
  bgLight: '#27234a',
  accent: '#3713ec',
  accentLight: '#7c5cfc',
  accentGlow: '#a78bfa',

  health: '#ef4444',
  healthDark: '#7f1d1d',
  healthMid: '#b91c1c',
  mana: '#3b82f6',
  manaDark: '#1e3a8a',

  gold: '#f59e0b',
  white: '#f6f6f8',
  textDim: '#8b8a9f',
  border: '#2e2860',

  // Spell colors
  bolt: '#a78bfa',
  boltGlow: '#c4b5fd',
  cannon: '#06b6d4',
  cannonGlow: '#67e8f9',
  shield: '#10b981',
  shieldGlow: '#6ee7b7',
  flash: '#fbbf24',
  flashGlow: '#fde68a',

  // Boss attack colors
  voidBolt: '#ef4444',
  voidBoltGlow: '#fca5a5',
  darkWave: '#8b5cf6',
  darkWaveGlow: '#c4b5fd',
  enrageBeam: '#f97316',
  enrageGlow: '#fdba74',

  // Stars
  star1: '#ffffff',
  star2: '#a78bfa',
  star3: '#06b6d4',
};

export const GAME = {
  SCREEN_W: W,
  SCREEN_H: H,

  // Arena boundaries
  ARENA_TOP: 100,
  ARENA_BOTTOM: H - 190,

  // Player
  PLAYER_X: W / 2,
  PLAYER_Y: H - 350,
  PLAYER_W: 56,
  PLAYER_H: 72,
  PLAYER_MAX_HP: 1000,
  PLAYER_MAX_MANA: 500,
  MANA_REGEN: 12, // per second

  // Boss — Balanced difficulty
  BOSS_X: W / 2,
  BOSS_Y: 155,
  BOSS_W: 110,
  BOSS_H: 90,
  BOSS_MAX_HP: 3000,
  BOSS_PHASE2_HP: 1500,
  BOSS_ATTACK_INTERVAL_P1: 2500, // ms
  BOSS_ATTACK_INTERVAL_P2: 1800, // ms
};
