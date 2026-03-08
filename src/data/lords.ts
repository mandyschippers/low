import type { Lord } from '../types'

export const LORDS: Lord[] = [
  // --- BASE GAME ---
  {
    id: 'brianne',
    name: 'Brianne Byndraeth',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Arcana', 'Skullduggery'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Arcana quest and each Skullduggery quest completed',
  },
  {
    id: 'caladorn',
    name: 'Caladorn Cassalanter',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Skullduggery', 'Warfare'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Skullduggery quest and each Warfare quest completed',
  },
  {
    id: 'durnan',
    name: 'Durnan "the Wanderer"',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Commerce', 'Warfare'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Commerce quest and each Warfare quest completed',
  },
  {
    id: 'kyriani',
    name: 'Kyriani Agrivar',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Arcana', 'Piety'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Arcana quest and each Piety quest completed',
  },
  {
    id: 'khelben',
    name: 'Khelben "Blackstaff" Arunsun',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Arcana', 'Warfare'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Arcana quest and each Warfare quest completed',
  },
  {
    id: 'larissa',
    name: 'Larissa Neathal',
    expansion: 'base',
    scoring: { kind: 'buildings', vpPerBuilding: 6 },
    bonusDescription: '+6 VP for each Building you own at game end',
  },
  {
    id: 'mirt',
    name: 'Mirt the Moneylender',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Commerce', 'Piety'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Commerce quest and each Piety quest completed',
  },
  {
    id: 'nindil',
    name: 'Nindil Jalbuck',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Piety', 'Skullduggery'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Piety quest and each Skullduggery quest completed',
  },
  {
    id: 'nymara',
    name: 'Nymara "Kitten" Scheiron',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Commerce', 'Skullduggery'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Commerce quest and each Skullduggery quest completed',
  },
  {
    id: 'piergeiron',
    name: 'Piergeiron the Paladinson',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Piety', 'Warfare'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Piety quest and each Warfare quest completed',
  },
  {
    id: 'sammereza',
    name: 'Sammereza Sulphontis',
    expansion: 'base',
    scoring: { kind: 'dual-quest', types: ['Arcana', 'Commerce'], vpPerQuest: 4 },
    bonusDescription: '+4 VP for each Arcana quest and each Commerce quest completed',
  },
  // --- UNDERMOUNTAIN EXPANSION ---
  {
    id: 'danilo',
    name: 'Danilo Thann',
    expansion: 'undermountain',
    scoring: { kind: 'all-quests', vpPerQuest: 3 },
    bonusDescription: '+3 VP for each non-mandatory quest completed (any type)',
  },
  {
    id: 'halaster',
    name: 'Halaster Blackcloak',
    expansion: 'undermountain',
    scoring: { kind: 'undermountain', vpPerItem: 4 },
    bonusDescription: '+4 VP for each Undermountain building owned and each Undermountain quest completed',
  },
  {
    id: 'trobriand',
    name: 'Trobriand',
    expansion: 'undermountain',
    scoring: { kind: 'high-value-quests', minVp: 10, vpPerQuest: 5 },
    bonusDescription: '+5 VP for each quest worth 10 or more Victory Points',
  },
]
