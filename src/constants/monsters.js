/**
 * 80 level — her level farklı canavar.
 * Her 10. level BOSS seviyesidir (2.5× HP, güçlü saldırılar).
 */

export const ALL_MONSTERS = [
  // ── TİER 1: Orman Canavarları (Lv 1–10) ─────────────────────────────────
  { emoji: '🐭', name: 'Dev Fare',           haloColor: '#a3a3a3', bgColor: 'rgba(120,113,108,0.12)', isBoss: false },
  { emoji: '🐸', name: 'Zehirli Kurbağa',   haloColor: '#86efac', bgColor: 'rgba(22,163,74,0.10)',   isBoss: false },
  { emoji: '🦔', name: 'Dikenli Kirpi',      haloColor: '#d6d3d1', bgColor: 'rgba(87,83,78,0.12)',    isBoss: false },
  { emoji: '🦊', name: 'Kurnaz Tilki',       haloColor: '#fb923c', bgColor: 'rgba(234,88,12,0.10)',   isBoss: false },
  { emoji: '🐺', name: 'Kurtadam',           haloColor: '#94a3b8', bgColor: 'rgba(71,85,105,0.12)',   isBoss: false },
  { emoji: '🐗', name: 'Kor Domuzu',         haloColor: '#c084fc', bgColor: 'rgba(126,34,206,0.10)',  isBoss: false },
  { emoji: '🦎', name: 'Ejder Kertenkele',   haloColor: '#4ade80', bgColor: 'rgba(22,163,74,0.12)',   isBoss: false },
  { emoji: '🐊', name: 'Bataklık Timsahı',  haloColor: '#2dd4bf', bgColor: 'rgba(15,118,110,0.12)',  isBoss: false },
  { emoji: '🦁', name: 'Aslan Ruhu',         haloColor: '#fbbf24', bgColor: 'rgba(217,119,6,0.12)',   isBoss: false },
  { emoji: '🦖', name: 'Tiranos Rex',        haloColor: '#f97316', bgColor: 'rgba(249,115,22,0.20)',  isBoss: true, bossTitle: '👑 BÖLGE BOSSU' },

  // ── TİER 2: Deniz & Hava (Lv 11–20) ─────────────────────────────────────
  { emoji: '🦅', name: 'Dev Kartal',         haloColor: '#fde68a', bgColor: 'rgba(180,120,0,0.12)',   isBoss: false },
  { emoji: '🕷️', name: 'Zehir Örümceği',   haloColor: '#a78bfa', bgColor: 'rgba(109,40,217,0.12)',  isBoss: false },
  { emoji: '🦂', name: 'Çöl Akrebi',        haloColor: '#fb7185', bgColor: 'rgba(190,18,60,0.12)',   isBoss: false },
  { emoji: '🐙', name: 'Karanlık Ahtapot',  haloColor: '#818cf8', bgColor: 'rgba(67,56,202,0.12)',   isBoss: false },
  { emoji: '🦑', name: 'Derin Kalamar',      haloColor: '#5eead4', bgColor: 'rgba(20,184,166,0.12)',  isBoss: false },
  { emoji: '🦈', name: 'Kan Köpek Balığı',  haloColor: '#f87171', bgColor: 'rgba(220,38,38,0.12)',   isBoss: false },
  { emoji: '🐋', name: 'Karanlık Balina',    haloColor: '#93c5fd', bgColor: 'rgba(29,78,216,0.12)',   isBoss: false },
  { emoji: '🐲', name: 'Ejder Yavrusu',      haloColor: '#6ee7b7', bgColor: 'rgba(5,150,105,0.12)',   isBoss: false },
  { emoji: '🦇', name: 'Gece Yarasa',        haloColor: '#c4b5fd', bgColor: 'rgba(109,40,217,0.12)',  isBoss: false },
  { emoji: '🦕', name: 'Kadim Dinozor',      haloColor: '#86efac', bgColor: 'rgba(21,128,61,0.22)',   isBoss: true, bossTitle: '👑 BÖLGE BOSSU' },

  // ── TİER 3: Ölümsüzler (Lv 21–30) ───────────────────────────────────────
  { emoji: '👻', name: 'Acı Hayalet',        haloColor: '#e2e8f0', bgColor: 'rgba(148,163,184,0.12)', isBoss: false },
  { emoji: '💀', name: 'İskelet Savaşçı',   haloColor: '#d4d4d4', bgColor: 'rgba(115,115,115,0.15)', isBoss: false },
  { emoji: '🧟', name: 'Çürük Zombi',        haloColor: '#84cc16', bgColor: 'rgba(77,124,15,0.12)',   isBoss: false },
  { emoji: '🧛', name: 'Gece Vampiri',       haloColor: '#c084fc', bgColor: 'rgba(126,34,206,0.15)',  isBoss: false },
  { emoji: '🐍', name: 'Zehir Yılanı',       haloColor: '#4ade80', bgColor: 'rgba(22,163,74,0.12)',   isBoss: false },
  { emoji: '🦴', name: 'Kemik Devisi',       haloColor: '#f5f5f4', bgColor: 'rgba(87,83,78,0.15)',    isBoss: false },
  { emoji: '🐜', name: 'Dev Karınca',        haloColor: '#dc2626', bgColor: 'rgba(185,28,28,0.12)',   isBoss: false },
  { emoji: '🐝', name: 'Zehir Arısı',        haloColor: '#fbbf24', bgColor: 'rgba(180,83,9,0.12)',    isBoss: false },
  { emoji: '🦗', name: 'Gece Çekirgesi',    haloColor: '#a3e635', bgColor: 'rgba(77,124,15,0.12)',   isBoss: false },
  { emoji: '☠️',  name: 'Lich Kral',         haloColor: '#e2e8f0', bgColor: 'rgba(15,23,42,0.40)',    isBoss: true, bossTitle: '💀 KARANLIK BOSSU' },

  // ── TİER 4: İblis Kuvvetleri (Lv 31–40) ─────────────────────────────────
  { emoji: '👹', name: 'Küçük İblis',        haloColor: '#f87171', bgColor: 'rgba(220,38,38,0.12)',   isBoss: false },
  { emoji: '👺', name: 'Maske İblisi',       haloColor: '#fb923c', bgColor: 'rgba(234,88,12,0.12)',   isBoss: false },
  { emoji: '🤖', name: 'Demir Golem',        haloColor: '#94a3b8', bgColor: 'rgba(51,65,85,0.15)',    isBoss: false },
  { emoji: '🧿', name: 'Göz Canavarı',       haloColor: '#818cf8', bgColor: 'rgba(67,56,202,0.15)',   isBoss: false },
  { emoji: '🐻', name: 'Karanlık Ayı',       haloColor: '#92400e', bgColor: 'rgba(120,53,15,0.15)',   isBoss: false },
  { emoji: '🐯', name: 'Kaplan Ruhu',        haloColor: '#fb923c', bgColor: 'rgba(194,65,12,0.12)',   isBoss: false },
  { emoji: '🐅', name: 'Bengal Ruhu',        haloColor: '#fbbf24', bgColor: 'rgba(180,83,9,0.12)',    isBoss: false },
  { emoji: '🦬', name: 'Bison Devisi',       haloColor: '#92400e', bgColor: 'rgba(120,53,15,0.12)',   isBoss: false },
  { emoji: '🦏', name: 'Gergedan Devisi',    haloColor: '#a8a29e', bgColor: 'rgba(87,83,78,0.15)',    isBoss: false },
  { emoji: '🐉', name: 'Kadim Ejder',        haloColor: '#2dd4bf', bgColor: 'rgba(6,78,59,0.28)',     isBoss: true, bossTitle: '🐉 EJDER BOSSU' },

  // ── TİER 5: Mistik Varlıklar (Lv 41–50) ─────────────────────────────────
  { emoji: '🦣', name: 'Mamut Canavarı',     haloColor: '#c4b5fd', bgColor: 'rgba(109,40,217,0.12)', isBoss: false },
  { emoji: '🦛', name: 'Su Aygırı Devisi',   haloColor: '#93c5fd', bgColor: 'rgba(29,78,216,0.12)',  isBoss: false },
  { emoji: '🐘', name: 'Karanlık Fil',       haloColor: '#d1d5db', bgColor: 'rgba(107,114,128,0.12)', isBoss: false },
  { emoji: '🦒', name: 'Boyun Canavarı',     haloColor: '#fbbf24', bgColor: 'rgba(180,83,9,0.12)',   isBoss: false },
  { emoji: '🦓', name: 'Çizgili Şeytan',    haloColor: '#e2e8f0', bgColor: 'rgba(51,65,85,0.15)',    isBoss: false },
  { emoji: '🐆', name: 'Leopar Ruhu',        haloColor: '#fcd34d', bgColor: 'rgba(161,98,7,0.12)',   isBoss: false },
  { emoji: '🦤', name: 'Ölümsüz Kuş',       haloColor: '#fdba74', bgColor: 'rgba(194,65,12,0.12)',  isBoss: false },
  { emoji: '🦚', name: 'Tavus Şeytanı',     haloColor: '#4ade80', bgColor: 'rgba(21,128,61,0.12)',  isBoss: false },
  { emoji: '🦜', name: 'Lanet Papağan',      haloColor: '#f87171', bgColor: 'rgba(185,28,28,0.12)',  isBoss: false },
  { emoji: '😈', name: 'İblis Lordu',        haloColor: '#f87171', bgColor: 'rgba(153,27,27,0.28)',  isBoss: true, bossTitle: '😈 İBLİS BOSSU' },

  // ── TİER 6: Kozmik Tehdit (Lv 51–60) ────────────────────────────────────
  { emoji: '🦉', name: 'Karanlık Baykuş',   haloColor: '#c4b5fd', bgColor: 'rgba(109,40,217,0.12)', isBoss: false },
  { emoji: '🦋', name: 'Ölüm Kelebeği',     haloColor: '#818cf8', bgColor: 'rgba(67,56,202,0.12)',  isBoss: false },
  { emoji: '🐛', name: 'Dev Tırtıl',         haloColor: '#86efac', bgColor: 'rgba(22,163,74,0.12)',  isBoss: false },
  { emoji: '🦟', name: 'Gece Sineği',        haloColor: '#6ee7b7', bgColor: 'rgba(5,150,105,0.12)',  isBoss: false },
  { emoji: '🐌', name: 'Zehir Salyangoz',   haloColor: '#a78bfa', bgColor: 'rgba(109,40,217,0.12)', isBoss: false },
  { emoji: '🦦', name: 'Gece Samuru',        haloColor: '#5eead4', bgColor: 'rgba(15,118,110,0.12)', isBoss: false },
  { emoji: '🦥', name: 'Tembel Şeytan',     haloColor: '#d6d3d1', bgColor: 'rgba(87,83,78,0.12)',   isBoss: false },
  { emoji: '🦫', name: 'Kunduz Şeytanı',    haloColor: '#92400e', bgColor: 'rgba(120,53,15,0.12)',  isBoss: false },
  { emoji: '🦝', name: 'Rakun Şeytanı',     haloColor: '#6b7280', bgColor: 'rgba(55,65,81,0.15)',   isBoss: false },
  { emoji: '🐉', name: 'Ejder İmparatoru',  haloColor: '#f59e0b', bgColor: 'rgba(146,64,14,0.30)',  isBoss: true, bossTitle: '🌟 EJDER İMPARATORU' },

  // ── TİER 7: Karanlık Tanrılar (Lv 61–70) ────────────────────────────────
  { emoji: '🦢', name: 'Kara Kuğu',          haloColor: '#1e1b4b', bgColor: 'rgba(30,27,75,0.15)',   isBoss: false },
  { emoji: '🕊️', name: 'Ölüm Güvercini',   haloColor: '#94a3b8', bgColor: 'rgba(51,65,85,0.12)',   isBoss: false },
  { emoji: '🐓', name: 'Ölümsüz Horoz',     haloColor: '#dc2626', bgColor: 'rgba(185,28,28,0.12)',  isBoss: false },
  { emoji: '🦃', name: 'Karanlık Goblen',   haloColor: '#7c2d12', bgColor: 'rgba(124,45,18,0.12)',  isBoss: false },
  { emoji: '🦩', name: 'Pembe Ölüm',         haloColor: '#f9a8d4', bgColor: 'rgba(190,24,93,0.12)',  isBoss: false },
  { emoji: '🦆', name: 'Ördek Şeytanı',    haloColor: '#7dd3fc', bgColor: 'rgba(2,132,199,0.12)',   isBoss: false },
  { emoji: '🐧', name: 'Buz Pengueni',       haloColor: '#bae6fd', bgColor: 'rgba(7,89,133,0.15)',   isBoss: false },
  { emoji: '🦤', name: 'Dodo Laneti',        haloColor: '#fdba74', bgColor: 'rgba(194,65,12,0.12)',  isBoss: false },
  { emoji: '🦅', name: 'Cehennem Kartalı',  haloColor: '#dc2626', bgColor: 'rgba(153,27,27,0.15)',  isBoss: false },
  { emoji: '👾', name: 'Boyut Canavarı',     haloColor: '#a78bfa', bgColor: 'rgba(88,28,135,0.30)',  isBoss: true, bossTitle: '👾 BOYUT BOSSU' },

  // ── TİER 8: Boşluk Varlıkları (Lv 71–80) ────────────────────────────────
  { emoji: '🧿', name: 'Boşluk Gözü',       haloColor: '#818cf8', bgColor: 'rgba(30,27,75,0.20)',   isBoss: false },
  { emoji: '💀', name: 'Boşluk İskeleti',   haloColor: '#c7d2fe', bgColor: 'rgba(30,27,75,0.20)',   isBoss: false },
  { emoji: '🧟', name: 'Boşluk Zombisi',    haloColor: '#a5b4fc', bgColor: 'rgba(30,27,75,0.20)',   isBoss: false },
  { emoji: '🧛', name: 'Boşluk Vampiri',    haloColor: '#818cf8', bgColor: 'rgba(30,27,75,0.22)',   isBoss: false },
  { emoji: '☠️',  name: 'Boşluk Ölümü',     haloColor: '#e0e7ff', bgColor: 'rgba(30,27,75,0.22)',   isBoss: false },
  { emoji: '🤖', name: 'Void Robotu',        haloColor: '#6366f1', bgColor: 'rgba(30,27,75,0.22)',   isBoss: false },
  { emoji: '👹', name: 'Void İblisi',        haloColor: '#f87171', bgColor: 'rgba(30,27,75,0.22)',   isBoss: false },
  { emoji: '😈', name: 'Void Şeytanı',      haloColor: '#818cf8', bgColor: 'rgba(30,27,75,0.25)',   isBoss: false },
  { emoji: '⚡',  name: 'Yıldırım Ruhu',     haloColor: '#fbbf24', bgColor: 'rgba(30,27,75,0.25)',   isBoss: false },
  {
    emoji: '🌌', name: 'BOŞLUK TANRISI',
    haloColor: '#818cf8', bgColor: 'rgba(30,27,75,0.45)',
    isBoss: true, bossTitle: '⚠ SON BOSS ⚠', isFinal: true,
  },
];

/** Level'a göre monster verisi (1-indexed) */
export function getMonsterForLevel(level) {
  const idx = Math.min(Math.max(level - 1, 0), ALL_MONSTERS.length - 1);
  return ALL_MONSTERS[idx];
}

/** HP hesaplama — boss levellerde 2.5× — genel olarak yarıya indirildi */
export function getBossHp(level) {
  const monster = getMonsterForLevel(level);
  const base = 750 + (level - 1) * 210;        // eskinin yarısı
  return Math.round(monster.isBoss ? base * 2.5 : base);
}

/** Saldırı intervalleri (ms) */
export function getAttackIntervals(level) {
  const monster = getMonsterForLevel(level);
  const groups = Math.floor((level - 1) / 5);
  const p1 = Math.max(1100, 2600 - groups * 130);
  const p2 = Math.max(750,  1800 - groups * 130);
  return {
    p1: monster.isBoss ? Math.round(p1 * 0.75) : p1,
    p2: monster.isBoss ? Math.round(p2 * 0.75) : p2,
  };
}

/** Boss hasar çarpanı */
export function getDamageMult(level) {
  const monster = getMonsterForLevel(level);
  const groups = Math.floor((level - 1) / 5);
  const base = Math.pow(1.18, groups);
  return monster.isBoss ? base * 1.4 : base;
}

/** Player hasar çarpanı — her levelda %5 artar */
export function getPlayerDamageMult(playerLevel) {
  return 1 + (playerLevel - 1) * 0.05;
}

export const MAX_LEVEL = 80;
