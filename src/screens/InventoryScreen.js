import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { COLORS } from '../constants/config';
import { ITEMS, getItemsByType } from '../constants/items';

const TABS = [
  { key: 'staff',     label: 'Asa',     icon: '🪄' },
  { key: 'robe',      label: 'Cübbe',   icon: '🧥' },
  { key: 'amulet',    label: 'Aksesuar',icon: '💍' },
  { key: 'spellpack', label: 'Büyüler', icon: '🔮' },
];

const UNLOCK_LABELS = {
  1: '', 10: 'Level 10', 20: 'Level 20', 30: 'Level 30', 40: 'Level 40',
  50: 'Level 50', 60: 'Level 60', 70: 'Level 70', 80: 'Level 80',
};

// ─── Item Kartı ───────────────────────────────────────────────────────────────
const ItemCard = ({ item, owned, equipped, canAfford, unlocked, onBuy, onEquip }) => {
  const locked     = !unlocked;
  const isEquipped = equipped;
  const canBuy     = unlocked && canAfford && !owned;

  const borderColor = isEquipped
    ? COLORS.gold
    : owned ? COLORS.accentGlow : locked ? '#2e2860' : canAfford ? COLORS.border : COLORS.healthDark;

  return (
    <View style={[styles.card, { borderColor, opacity: locked ? 0.5 : 1 }]}>
      {/* Sol: emoji + bilgi */}
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        <View>
          <Text style={[styles.cardName, { color: isEquipped ? COLORS.gold : COLORS.white }]}>
            {item.name}
          </Text>
          <Text style={styles.cardDesc}>{item.desc}</Text>
        </View>
      </View>

      {/* Sağ: fiyat + buton */}
      <View style={styles.cardRight}>
        {locked ? (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>🔒 Lv {item.unlockLevel}</Text>
          </View>
        ) : isEquipped ? (
          <View style={[styles.actionBtn, styles.equippedBtn]}>
            <Text style={styles.actionBtnText}>✓ Donatıldı</Text>
          </View>
        ) : owned ? (
          <TouchableOpacity style={[styles.actionBtn, styles.equipBtn]} onPress={() => onEquip(item.id)}>
            <Text style={styles.actionBtnText}>Donat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, canBuy ? styles.buyBtn : styles.noGoldBtn]}
            onPress={() => canBuy && onBuy(item.id)}
            disabled={!canBuy}
          >
            <Text style={styles.actionBtnText}>
              {canBuy ? `💰 ${item.price.toLocaleString()}` : `💰 ${item.price.toLocaleString()}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
const InventoryScreen = ({
  gold,
  bossLevel,
  ownedItemIds,
  equippedItems,
  initialTab = 'staff',
  onBuy,
  onEquip,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const items = activeTab === 'spellpack'
    ? [...getItemsByType('spell'), ...getItemsByType('spellpack')]
        .sort((a, b) => a.unlockLevel - b.unlockLevel || a.price - b.price)
    : getItemsByType(activeTab);

  // Unlock level eşiklerine göre grupla
  const groups = [];
  let currentLevel = null;
  items.forEach(item => {
    if (item.unlockLevel !== currentLevel) {
      currentLevel = item.unlockLevel;
      groups.push({ level: currentLevel, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  });

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎒 Envanter</Text>
        <View style={styles.goldBox}>
          <Text style={styles.goldText}>💰 {gold.toLocaleString()}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item listesi */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {groups.map(group => (
          <View key={group.level}>
            {group.level > 1 && (
              <View style={styles.groupHeader}>
                <View style={styles.groupLine} />
                <Text style={styles.groupLabel}>
                  {group.level <= bossLevel ? `✅ ${UNLOCK_LABELS[group.level]}` : `🔒 ${UNLOCK_LABELS[group.level]}`}
                </Text>
                <View style={styles.groupLine} />
              </View>
            )}
            {group.items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                owned={ownedItemIds.has(item.id)}
                equipped={equippedItems[item.type] === item.id}
                canAfford={gold >= item.price}
                unlocked={item.price === 0 || bossLevel >= item.unlockLevel}
                onBuy={onBuy}
                onEquip={onEquip}
              />
            ))}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1c1836',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    color: COLORS.accentGlow,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  goldBox: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  goldText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '800',
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1c1836',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 2,
  },
  tabActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(55,19,236,0.15)',
  },
  tabIcon: { fontSize: 18 },
  tabLabel: { color: COLORS.textDim, fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: COLORS.accentGlow, fontWeight: '800' },

  // List
  list: { flex: 1 },
  listContent: { padding: 12, gap: 8 },

  // Group separator
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  groupLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  groupLabel: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Item Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c1836',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 4,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardEmoji: { fontSize: 28 },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDesc: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  cardRight: { alignItems: 'flex-end' },
  lockBadge: {
    backgroundColor: 'rgba(46,40,96,0.5)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  lockText: { color: COLORS.textDim, fontSize: 11, fontWeight: '700' },
  actionBtn: {
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 90,
    alignItems: 'center',
  },
  buyBtn:      { backgroundColor: COLORS.accent },
  noGoldBtn:   { backgroundColor: '#3b1d1d' },
  equipBtn:    { backgroundColor: '#1c3a1c', borderWidth: 1, borderColor: COLORS.accentGlow },
  equippedBtn: { backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: COLORS.gold },
  actionBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
});
