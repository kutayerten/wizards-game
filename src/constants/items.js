/**
 * Oyun item sistemi
 * type: 'staff' | 'robe' | 'amulet'
 * unlockLevel: hangi leveldan itibaren satın alınabilir
 */

export const ITEMS = {
  // ─── BÜYÜ PAKETLERİ (her zaman açık, satın alınabilir) ──────────────────
  spellpack_fire: {
    id: 'spellpack_fire', type: 'spellpack',
    name: 'Ateş Büyüleri', emoji: '🔥',
    desc: 'Tüm büyüler ateş topu olarak ateşlenir',
    price: 250, unlockLevel: 1,
    bonuses: { spellElement: 'fire' },
  },
  spellpack_lightning: {
    id: 'spellpack_lightning', type: 'spellpack',
    name: 'Şimşek Büyüleri', emoji: '⚡',
    desc: 'Tüm büyüler elektrik yıldırımı olarak ateşlenir',
    price: 250, unlockLevel: 1,
    bonuses: { spellElement: 'lightning' },
  },
  spellpack_cold: {
    id: 'spellpack_cold', type: 'spellpack',
    name: 'Buz Büyüleri', emoji: '❄️',
    desc: 'Tüm büyüler buz kristali olarak ateşlenir',
    price: 250, unlockLevel: 1,
    bonuses: { spellElement: 'cold' },
  },

  // ─── VARSAYILAN (ücretsiz, her zaman sahip) ──────────────────────────────
  staff_default: {
    id: 'staff_default', type: 'staff',
    name: 'Ahşap Asa', emoji: '🪄', desc: 'Başlangıç asası',
    price: 0, unlockLevel: 1,
    bonuses: { damageMult: 1.0, glowColor: '#a78bfa' },
    isDefault: true,
  },
  robe_default: {
    id: 'robe_default', type: 'robe',
    name: 'Çırak Cübbesi', emoji: '🎽', desc: 'Sıradan bir cübbe',
    price: 0, unlockLevel: 1,
    bonuses: { maxHpBonus: 0, playerEmoji: '🧙' },
    isDefault: true,
  },

  // ─── SATINALINABILIR AKTİF BÜYÜ ──────────────────────────────────────────
  spell_arcbolt: {
    id: 'spell_arcbolt', type: 'spell',
    name: 'Ark Işın', emoji: '〰️',
    desc: 'Zigzag ışın — düşmana anında ulaşır • 500 hasar',
    price: 1000, unlockLevel: 10,
    bonuses: { spellId: 'arcbolt' },
  },

  // ─── LEVEL 10 (Temel Güçlendirme) ────────────────────────────────────────
  staff_crystal: {
    id: 'staff_crystal', type: 'staff',
    name: 'Kristal Asa', emoji: '🔮', desc: '+20% hasar • Mavi parıltı',
    price: 150, unlockLevel: 10,
    bonuses: { damageMult: 1.20, glowColor: '#06b6d4' },
  },
  robe_magic: {
    id: 'robe_magic', type: 'robe',
    name: 'Sihirli Cübbe', emoji: '🧥', desc: '+100 Max HP',
    price: 120, unlockLevel: 10,
    bonuses: { maxHpBonus: 100, playerEmoji: '🧙‍♂️' },
  },
  ring_iron: {
    id: 'ring_iron', type: 'amulet',
    name: 'Demir Yüzük', emoji: '💍', desc: '+3 Mana/sn • +5% hasar',
    price: 80, unlockLevel: 10,
    bonuses: { damageMult: 1.05, maxHpBonus: 30, manaRegen: 3 },
  },

  // ─── LEVEL 20 ─────────────────────────────────────────────────────────────
  staff_thunder: {
    id: 'staff_thunder', type: 'staff',
    name: 'Şimşek Asası', emoji: '⚡', desc: '+40% hasar • Sarı parıltı',
    price: 500, unlockLevel: 20,
    bonuses: { damageMult: 1.40, glowColor: '#fbbf24' },
  },
  robe_dragon: {
    id: 'robe_dragon', type: 'robe',
    name: 'Ejder Derisi', emoji: '🐲', desc: '+220 Max HP',
    price: 450, unlockLevel: 20,
    bonuses: { maxHpBonus: 220, playerEmoji: '🧝‍♂️' },
  },
  necklace_power: {
    id: 'necklace_power', type: 'amulet',
    name: 'Güç Kolyesi', emoji: '📿', desc: '+5 Mana/sn • +10% hasar',
    price: 350, unlockLevel: 20,
    bonuses: { damageMult: 1.10, maxHpBonus: 60, manaRegen: 5 },
  },

  // ─── LEVEL 30 ─────────────────────────────────────────────────────────────
  staff_fire: {
    id: 'staff_fire', type: 'staff',
    name: 'Ateş Asası', emoji: '🔥', desc: '+60% hasar • Turuncu parıltı',
    price: 1200, unlockLevel: 30,
    bonuses: { damageMult: 1.60, glowColor: '#f97316' },
  },
  robe_ancient: {
    id: 'robe_ancient', type: 'robe',
    name: 'Kadim Cübbe', emoji: '📜', desc: '+380 Max HP',
    price: 1000, unlockLevel: 30,
    bonuses: { maxHpBonus: 380, playerEmoji: '🧝' },
  },
  ring_dragon: {
    id: 'ring_dragon', type: 'amulet',
    name: 'Ejder Yüzüğü', emoji: '🐉', desc: '+7 Mana/sn • +15% hasar',
    price: 900, unlockLevel: 30,
    bonuses: { damageMult: 1.15, maxHpBonus: 100, manaRegen: 7 },
  },

  // ─── LEVEL 40 ─────────────────────────────────────────────────────────────
  staff_moon: {
    id: 'staff_moon', type: 'staff',
    name: 'Ay Asası', emoji: '🌙', desc: '+85% hasar • İndigo parıltı',
    price: 2500, unlockLevel: 40,
    bonuses: { damageMult: 1.85, glowColor: '#818cf8' },
  },
  robe_celestial: {
    id: 'robe_celestial', type: 'robe',
    name: 'Göksel Cübbe', emoji: '✨', desc: '+560 Max HP',
    price: 2200, unlockLevel: 40,
    bonuses: { maxHpBonus: 560, playerEmoji: '🧝‍♀️' },
  },
  crown_shadow: {
    id: 'crown_shadow', type: 'amulet',
    name: 'Gölge Tacı', emoji: '👑', desc: '+10 Mana/sn • +20% hasar',
    price: 2000, unlockLevel: 40,
    bonuses: { damageMult: 1.20, maxHpBonus: 150, manaRegen: 10 },
  },

  // ─── LEVEL 50 ─────────────────────────────────────────────────────────────
  staff_star: {
    id: 'staff_star', type: 'staff',
    name: 'Yıldız Asası', emoji: '🌟', desc: '+110% hasar • Altın parıltı',
    price: 5000, unlockLevel: 50,
    bonuses: { damageMult: 2.10, glowColor: '#fde68a' },
  },
  robe_shadow: {
    id: 'robe_shadow', type: 'robe',
    name: 'Gölge Cübbesi', emoji: '🌑', desc: '+750 Max HP',
    price: 4500, unlockLevel: 50,
    bonuses: { maxHpBonus: 750, playerEmoji: '🧟‍♂️' },
  },
  orb_void: {
    id: 'orb_void', type: 'amulet',
    name: 'Void Küre', emoji: '🔮', desc: '+12 Mana/sn • +25% hasar',
    price: 4000, unlockLevel: 50,
    bonuses: { damageMult: 1.25, maxHpBonus: 200, manaRegen: 12 },
  },

  // ─── LEVEL 60 ─────────────────────────────────────────────────────────────
  staff_void: {
    id: 'staff_void', type: 'staff',
    name: 'Void Asası', emoji: '🌀', desc: '+150% hasar • Koyu mor parıltı',
    price: 9500, unlockLevel: 60,
    bonuses: { damageMult: 2.50, glowColor: '#4f46e5' },
  },
  robe_cosmic: {
    id: 'robe_cosmic', type: 'robe',
    name: 'Kozmik Cübbe', emoji: '🪐', desc: '+950 Max HP',
    price: 8500, unlockLevel: 60,
    bonuses: { maxHpBonus: 950, playerEmoji: '🧜‍♂️' },
  },
  gem_cosmos: {
    id: 'gem_cosmos', type: 'amulet',
    name: 'Kozmik Mücevher', emoji: '💎', desc: '+15 Mana/sn • +30% hasar',
    price: 7500, unlockLevel: 60,
    bonuses: { damageMult: 1.30, maxHpBonus: 300, manaRegen: 15 },
  },

  // ─── LEVEL 70 ─────────────────────────────────────────────────────────────
  staff_legend: {
    id: 'staff_legend', type: 'staff',
    name: 'Efsane Asası', emoji: '🗡️', desc: '+200% hasar • Zümrüt parıltı',
    price: 18000, unlockLevel: 70,
    bonuses: { damageMult: 3.00, glowColor: '#10b981' },
  },
  robe_god: {
    id: 'robe_god', type: 'robe',
    name: 'Tanrı Cübbesi', emoji: '🌠', desc: '+1200 Max HP',
    price: 16000, unlockLevel: 70,
    bonuses: { maxHpBonus: 1200, playerEmoji: '🧚‍♂️' },
  },
  talisman_god: {
    id: 'talisman_god', type: 'amulet',
    name: 'Tanrı Tılsımı', emoji: '🔱', desc: '+20 Mana/sn • +35% hasar',
    price: 14000, unlockLevel: 70,
    bonuses: { damageMult: 1.35, maxHpBonus: 400, manaRegen: 20 },
  },

  // ─── LEVEL 80 (ULTIMATE) ──────────────────────────────────────────────────
  staff_divine: {
    id: 'staff_divine', type: 'staff',
    name: 'İlahi Asa', emoji: '💎', desc: '+300% hasar • Beyaz parıltı',
    price: 35000, unlockLevel: 80,
    bonuses: { damageMult: 4.00, glowColor: '#f8fafc' },
  },
  robe_divine: {
    id: 'robe_divine', type: 'robe',
    name: 'İlahi Cübbe', emoji: '👼', desc: '+1600 Max HP',
    price: 32000, unlockLevel: 80,
    bonuses: { maxHpBonus: 1600, playerEmoji: '👼' },
  },
  heart_universe: {
    id: 'heart_universe', type: 'amulet',
    name: 'Evren Kalbi', emoji: '💫', desc: '+25 Mana/sn • +50% hasar',
    price: 28000, unlockLevel: 80,
    bonuses: { damageMult: 1.50, maxHpBonus: 500, manaRegen: 25 },
  },
};

/** Equipped item ID'lerinden aktif bonusları hesapla */
export function computeEquippedBonuses(equippedItems) {
  const staff = ITEMS[equippedItems?.staff] ?? ITEMS.staff_default;
  const robe  = ITEMS[equippedItems?.robe]  ?? ITEMS.robe_default;
  const am    = equippedItems?.amulet    ? ITEMS[equippedItems.amulet]    : null;
  const sp    = equippedItems?.spellpack ? ITEMS[equippedItems.spellpack] : null;
  const spItem = equippedItems?.spell    ? ITEMS[equippedItems.spell]    : null;

  return {
    damageMult:    staff.bonuses.damageMult * (am?.bonuses?.damageMult ?? 1),
    maxHpBonus:    robe.bonuses.maxHpBonus  + (am?.bonuses?.maxHpBonus ?? 0),
    manaRegenBonus: am?.bonuses?.manaRegen ?? 0,
    playerEmoji:   robe.bonuses.playerEmoji,
    staffGlowColor: staff.bonuses.glowColor,
    spellElement:  sp?.bonuses?.spellElement ?? null,
    extraSpellId:  spItem?.bonuses?.spellId ?? null,
  };
}

/** Level'da kazanılan altın */
export function getGoldReward(bossLevel) {
  const isBoss = bossLevel % 10 === 0;
  const base = 60 + bossLevel * 18;
  return Math.round(isBoss ? base * 3 : base);
}

/** Tüm itemleri tip ve unlock sırasına göre döner */
export function getItemsByType(type) {
  return Object.values(ITEMS)
    .filter(i => i.type === type)
    .sort((a, b) => a.unlockLevel - b.unlockLevel);
}
