import type { Quest, RankedQuest, Lord, ScarcityMap, QuestRankOptions, ScoreTier } from '../types'

const SCARCITY_WEIGHTS = { scarce: 3.0, normal: 1.5, abundant: 1.0 } as const
const PLOT_BONUS_VP = 10

function computeLordBonusVP(quest: Quest, lord: Lord | null, plotEstimatedVP: number): number {
  if (lord === null) return 0
  const scoring = lord.scoring

  if (scoring.kind === 'dual-quest') {
    return scoring.types.includes(quest.type) ? scoring.vpPerQuest : 0
  }
  if (scoring.kind === 'all-quests') {
    return !quest.isPlot ? scoring.vpPerQuest : 0
  }
  if (scoring.kind === 'high-value-quests') {
    return (quest.vp + plotEstimatedVP) >= scoring.minVp ? scoring.vpPerQuest : 0
  }
  if (scoring.kind === 'buildings') {
    return 0
  }
  if (scoring.kind === 'undermountain') {
    return quest.type === 'Undermountain' ? scoring.vpPerItem : 0
  }
  return 0
}

function tierFromScore(score: number): ScoreTier {
  if (score >= 5.0) return 'S'
  if (score >= 3.5) return 'A'
  if (score >= 2.5) return 'B'
  if (score >= 1.5) return 'C'
  return 'D'
}

function buildReasoning(
  quest: Quest,
  lord: Lord | null,
  lordBonusVP: number,
  effectiveVP: number,
  costDifficulty: number,
  score: number,
  effectiveScarcity: ScarcityMap,
): string[] {
  const lines: string[] = []
  lines.push(`Base VP: ${quest.vp}`)
  if (quest.isPlot) {
    lines.push(`Plot effect: +${PLOT_BONUS_VP} estimated VP (ongoing benefit)`)
  }
  if (lordBonusVP > 0 && lord) {
    lines.push(`Lord bonus: +${lordBonusVP} VP (${lord.name})`)
  }
  lines.push(`Effective VP: ${effectiveVP}`)

  for (const [resource, amount] of Object.entries(quest.cost) as [keyof typeof effectiveScarcity, number][]) {
    const level = effectiveScarcity[resource]
    if (level === 'scarce') {
      lines.push(`${amount} ${resource} is scarce — increases cost difficulty (weight ×3.0)`)
    } else if (level === 'abundant') {
      lines.push(`${amount} ${resource} is abundant — reduces cost difficulty (weight ×1.0)`)
    }
  }

  lines.push(`Cost difficulty: ${costDifficulty.toFixed(1)}`)
  lines.push(`Score: ${score.toFixed(2)} (effective VP ÷ cost difficulty)`)
  return lines
}

export function rankQuests(
  quests: Quest[],
  lord: Lord | null,
  scarcity: ScarcityMap,
  options: QuestRankOptions,
): RankedQuest[] {
  const effectiveScarcity: ScarcityMap = options.useCurrentScarcity
    ? scarcity
    : { fighters: 'normal', rogues: 'normal', clerics: 'normal', wizards: 'normal', gold: 'normal' }

  const scored = quests.map(quest => {
    const plotEstimatedVP = quest.isPlot ? PLOT_BONUS_VP : 0
    const lordBonusVP = computeLordBonusVP(quest, lord, plotEstimatedVP)
    const effectiveVP = quest.vp + lordBonusVP + plotEstimatedVP

    const rawDifficulty = Object.entries(quest.cost).reduce((sum, [resource, amount]) => {
      const level = effectiveScarcity[resource as keyof ScarcityMap]
      return sum + (amount ?? 0) * SCARCITY_WEIGHTS[level]
    }, 0)
    const costDifficulty = Math.max(1.0, rawDifficulty)

    const score = effectiveVP / costDifficulty
    const tier = tierFromScore(score)
    const reasoning = buildReasoning(quest, lord, lordBonusVP, effectiveVP, costDifficulty, score, effectiveScarcity)

    return { quest, score, effectiveVP, costDifficulty, lordBonusVP, plotEstimatedVP, tier, reasoning }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.map((entry, i) => ({ ...entry, rank: i + 1 }))
}
