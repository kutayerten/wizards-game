import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import { ITEMS, computeEquippedBonuses } from './src/constants/items';

const DEFAULT_OWNED = new Set(['staff_default', 'robe_default']);
const DEFAULT_EQUIPPED = { staff: 'staff_default', robe: 'robe_default', amulet: null, spellpack: null, spell: null };

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' | 'game'
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryTab, setInventoryTab]   = useState('staff');

  // ── Kalıcı oyuncu durumu ─────────────────────────────────────────────────
  const [gold, setGold] = useState(0);
  const [bossLevel, setBossLevel] = useState(1);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [ownedItemIds, setOwnedItemIds] = useState(DEFAULT_OWNED);
  const [equippedItems, setEquippedItems] = useState(DEFAULT_EQUIPPED);

  const equippedBonuses = computeEquippedBonuses(equippedItems);

  // ── Envanter işlemleri ────────────────────────────────────────────────────
  const handleBuy = (itemId) => {
    const item = ITEMS[itemId];
    if (!item || gold < item.price || ownedItemIds.has(itemId)) return;
    setGold(prev => prev - item.price);
    setOwnedItemIds(prev => new Set([...prev, itemId]));
    // Satın alınca otomatik donat
    setEquippedItems(prev => ({ ...prev, [item.type]: itemId }));
  };

  const handleEquip = (itemId) => {
    const item = ITEMS[itemId];
    if (!item || !ownedItemIds.has(itemId)) return;
    setEquippedItems(prev => ({ ...prev, [item.type]: itemId }));
  };

  // ── Oyun olayları ─────────────────────────────────────────────────────────
  const handleVictory = (goldEarned, newBossLevel, newPlayerLevel, savedHp) => {
    setGold(prev => prev + goldEarned);
    setBossLevel(newBossLevel);
    setPlayerLevel(newPlayerLevel);
  };

  const handleRestart = (level, plevel) => {
    setBossLevel(level);
    setPlayerLevel(plevel);
  };

  return (
    <>
      <StatusBar hidden />

      {screen === 'menu' && (
        <MenuScreen onStart={() => setScreen('game')} />
      )}

      {screen === 'game' && (
        <GameScreen
          bossLevel={bossLevel}
          playerLevel={playerLevel}
          gold={gold}
          equippedBonuses={equippedBonuses}
          onVictory={handleVictory}
          onRestart={handleRestart}
          onOpenInventory={(tab) => { setInventoryTab(typeof tab === 'string' ? tab : 'staff'); setShowInventory(true); }}
          onExit={() => setScreen('menu')}
        />
      )}

      {/* Envanter overlay — oyun üstünde açılır */}
      {showInventory && (
        <InventoryScreen
          gold={gold}
          bossLevel={bossLevel}
          ownedItemIds={ownedItemIds}
          equippedItems={equippedItems}
          initialTab={inventoryTab}
          onBuy={handleBuy}
          onEquip={handleEquip}
          onClose={() => setShowInventory(false)}
        />
      )}
    </>
  );
}
