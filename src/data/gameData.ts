import type { QuestType, ResourceType } from '../types'

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  fighters: 'Fighters',
  rogues: 'Rogues',
  clerics: 'Clerics',
  wizards: 'Wizards',
  gold: 'Gold',
}

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  fighters: 'bg-orange-500',
  rogues: 'bg-gray-600',
  clerics: 'bg-gray-200 text-gray-800',
  wizards: 'bg-purple-600',
  gold: 'bg-yellow-500',
}

export const RESOURCE_DOT_COLORS: Record<ResourceType, string> = {
  fighters: '#e07020',
  rogues: '#555555',
  clerics: '#d4d4d4',
  wizards: '#7b3fc4',
  gold: '#c9a227',
}

// Primary resource for each quest type
export const QUEST_PRIMARY_RESOURCE: Partial<Record<QuestType, ResourceType>> = {
  Arcana: 'wizards',
  Commerce: 'gold',
  Piety: 'clerics',
  Skullduggery: 'rogues',
  Warfare: 'fighters',
}

// Buildings that provide each resource type
export const RESOURCE_BUILDINGS: Record<ResourceType, string[]> = {
  fighters: ['Field of Triumph', 'House of Heroes', 'Smuggler\'s Dock', 'Caravan Court'],
  rogues: ['Grinning Lion Tavern', 'Jesters\' Court', 'Smuggler\'s Dock'],
  clerics: ['The Plinth', 'House of Heroes', 'Spires of the Morning'],
  wizards: ['Blackstaff Tower', 'Dragon Tower', 'Tower of the Order'],
  gold: ['Aurora\'s Realms Shop', 'The Stone House', 'Builder\'s Hall'],
}

// Quest type descriptions
export const QUEST_TYPE_INFO: Record<QuestType, { primary: ResourceType[]; description: string }> = {
  Arcana: {
    primary: ['wizards'],
    description: 'Primarily requires Wizards (purple). High individual value. Intrigue card synergy.',
  },
  Commerce: {
    primary: ['gold', 'fighters', 'rogues'],
    description: 'Requires Gold plus mixed adventurers. Flexible but gold-intensive.',
  },
  Piety: {
    primary: ['clerics'],
    description: 'Primarily requires Clerics (white). Often easier to complete than Arcana.',
  },
  Skullduggery: {
    primary: ['rogues'],
    description: 'Primarily requires Rogues (black). Good for disruption via Intrigue cards.',
  },
  Warfare: {
    primary: ['fighters'],
    description: 'Primarily requires Fighters (orange). Abundant resource — high volume potential.',
  },
  Undermountain: {
    primary: ['fighters', 'rogues', 'clerics', 'wizards'],
    description: 'Undermountain quests have higher demands and higher VP rewards (up to 40 VP).',
  },
}
