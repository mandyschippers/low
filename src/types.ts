export type QuestType = 'Arcana' | 'Commerce' | 'Piety' | 'Skullduggery' | 'Warfare' | 'Undermountain'

export type ResourceType = 'fighters' | 'rogues' | 'clerics' | 'wizards' | 'gold'

export type ScarcityLevel = 'scarce' | 'normal' | 'abundant'

export type ScarcityMap = Record<ResourceType, ScarcityLevel>

export type LordScoringType =
  | { kind: 'dual-quest'; types: [QuestType, QuestType]; vpPerQuest: number }
  | { kind: 'buildings'; vpPerBuilding: number }
  | { kind: 'all-quests'; vpPerQuest: number }
  | { kind: 'high-value-quests'; minVp: number; vpPerQuest: number }
  | { kind: 'undermountain'; vpPerItem: number }

export interface Lord {
  id: string
  name: string
  expansion: 'base' | 'undermountain'
  scoring: LordScoringType
  bonusDescription: string
}

export interface BuildingTarget {
  name: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

export interface Quest {
  id: string
  name: string
  type: QuestType
  cost: Partial<Record<ResourceType, number>>
  vp: number
  isPlot: boolean
  plotEffect?: string
  bonus?: string
  expansion: 'base' | 'undermountain'
}

export interface RankedQuest {
  quest: Quest
  rank: number
  score: number
  effectiveVP: number
  costDifficulty: number
  lordBonusVP: number
  plotEstimatedVP: number
  tier: ScoreTier
  reasoning: string[]
}

export type ScoreTier = 'S' | 'A' | 'B' | 'C' | 'D'

export interface QuestRankOptions {
  includeLordBonus: boolean
  useCurrentScarcity: boolean
}

export interface StrategyReport {
  lord: Lord
  questPriorities: { type: QuestType | 'any'; rationale: string }[]
  resourcePriorities: { resource: ResourceType; rationale: string }[]
  buildingTargets: BuildingTarget[]
  warnings: string[]
  opportunities: string[]
  lordTip: string
}
