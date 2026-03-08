import { useState, useMemo } from 'react'
import type { Lord, ScarcityMap, QuestType, RankedQuest, ScoreTier } from '../types'
import { QUESTS } from '../data/quests'
import { rankQuests } from '../engine/questRanker'
import { RESOURCE_DOT_COLORS } from '../data/gameData'

interface Props {
  lord: Lord | null
  scarcity: ScarcityMap
}

const TIER_CLASSES: Record<ScoreTier, string> = {
  S: 'bg-yellow-400 text-yellow-900',
  A: 'bg-green-600 text-green-100',
  B: 'bg-blue-600 text-blue-100',
  C: 'bg-gray-600 text-gray-200',
  D: 'bg-red-900 text-red-300',
}

const QUEST_TYPE_CHIP: Record<QuestType, string> = {
  Arcana: 'bg-purple-900 text-purple-200 border-purple-700',
  Commerce: 'bg-yellow-900 text-yellow-200 border-yellow-700',
  Piety: 'bg-blue-900 text-blue-200 border-blue-700',
  Skullduggery: 'bg-gray-800 text-gray-200 border-gray-600',
  Warfare: 'bg-orange-900 text-orange-200 border-orange-700',
  Undermountain: 'bg-teal-900 text-teal-200 border-teal-700',
}

const RESOURCE_SHORT: Record<string, string> = {
  fighters: 'F',
  rogues: 'R',
  clerics: 'C',
  wizards: 'W',
  gold: 'G',
}

const ALL_QUEST_TYPES: (QuestType | 'all')[] = ['all', 'Arcana', 'Commerce', 'Piety', 'Skullduggery', 'Warfare', 'Undermountain']

function CostDisplay({ cost }: { cost: Partial<Record<string, number>> }) {
  return (
    <span className="flex flex-wrap gap-1">
      {Object.entries(cost).map(([resource, amount]) => (
        <span key={resource} className="flex items-center gap-0.5 text-xs">
          <span
            className="w-2 h-2 rounded-full inline-block border border-white/20"
            style={{ backgroundColor: RESOURCE_DOT_COLORS[resource as keyof typeof RESOURCE_DOT_COLORS] ?? '#888' }}
          />
          <span className="text-parchment/70">{amount}{RESOURCE_SHORT[resource] ?? resource[0].toUpperCase()}</span>
        </span>
      ))}
    </span>
  )
}

function ScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = Math.round((score / maxScore) * 100)
  return (
    <div className="w-16 h-1.5 bg-light-purple/20 rounded-full overflow-hidden flex-shrink-0">
      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
    </div>
  )
}

function QuestRow({ ranked, maxScore, showLordBonus }: { ranked: RankedQuest; maxScore: number; showLordBonus: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const { quest, rank, score, tier, effectiveVP, lordBonusVP, reasoning } = ranked

  return (
    <li className="border border-light-purple/30 rounded-lg overflow-hidden">
      <button
        className="w-full text-left px-3 py-2 hover:bg-mid-purple/60 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex flex-col gap-1">
          {/* Row 1: rank, tier, name, chevron */}
          <div className="flex items-center gap-2">
            <span className="text-parchment/40 text-xs w-6 flex-shrink-0 text-right">#{rank}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${TIER_CLASSES[tier]}`}>
              {tier}
            </span>
            <span className="font-medium text-sm text-parchment flex-1 min-w-0 truncate">
              {quest.name}
              {quest.isPlot && (
                <span className="ml-1.5 text-xs text-gold/70 border border-gold/40 px-1 py-0.5 rounded">Plot</span>
              )}
            </span>
            <span className="text-parchment/30 text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
          </div>

          {/* Row 2: type, cost, VP, score */}
          <div className="flex items-center gap-2 pl-8 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${QUEST_TYPE_CHIP[quest.type]}`}>
              {quest.type}
            </span>
            <div className="flex-shrink-0">
              <CostDisplay cost={quest.cost} />
            </div>
            <span className="text-xs text-parchment/60 flex-shrink-0 ml-auto">
              {quest.vp} VP
              {showLordBonus && lordBonusVP > 0 && (
                <span className="text-green-400"> +{lordBonusVP}</span>
              )}
            </span>
            <ScoreBar score={score} maxScore={maxScore} />
            <span className="text-xs text-parchment/40 w-8 text-right flex-shrink-0">
              {score.toFixed(1)}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 bg-mid-purple/30 border-t border-light-purple/20 space-y-2 text-xs text-parchment/70">
          {quest.plotEffect && (
            <p><span className="text-gold font-semibold">Plot effect:</span> {quest.plotEffect}</p>
          )}
          {quest.bonus && (
            <p><span className="text-green-400 font-semibold">Completion bonus:</span> {quest.bonus}</p>
          )}
          <div>
            <p className="text-parchment/50 uppercase tracking-widest text-xs mb-1">Scoring breakdown</p>
            <ul className="space-y-0.5">
              {reasoning.map((line, i) => (
                <li key={i} className="text-parchment/60">— {line}</li>
              ))}
            </ul>
          </div>
          <p className="text-parchment/40">Effective VP: {effectiveVP}</p>
        </div>
      )}
    </li>
  )
}

export function QuestRanker({ lord, scarcity }: Props) {
  const [includeLordBonus, setIncludeLordBonus] = useState(true)
  const [useCurrentScarcity, setUseCurrentScarcity] = useState(true)
  const [typeFilter, setTypeFilter] = useState<QuestType | 'all'>('all')
  const [plotFilter, setPlotFilter] = useState<'all' | 'plot' | 'regular'>('all')
  const [expansionFilter, setExpansionFilter] = useState<'all' | 'base'>('all')

  const isLarissa = lord?.scoring.kind === 'buildings'
  const effectiveLord = includeLordBonus && !isLarissa ? lord : null

  const questPool = useMemo(
    () => expansionFilter === 'base' ? QUESTS.filter(q => q.expansion === 'base') : QUESTS,
    [expansionFilter],
  )

  const ranked = useMemo(
    () => rankQuests(questPool, effectiveLord, scarcity, { includeLordBonus, useCurrentScarcity }),
    [questPool, effectiveLord, scarcity, includeLordBonus, useCurrentScarcity],
  )

  const maxScore = useMemo(() => Math.max(...ranked.map(r => r.score), 1), [ranked])

  const filtered = useMemo(() => {
    return ranked.filter(r => {
      if (typeFilter !== 'all' && r.quest.type !== typeFilter) return false
      if (plotFilter === 'plot' && !r.quest.isPlot) return false
      if (plotFilter === 'regular' && r.quest.isPlot) return false
      return true
    })
  }, [ranked, typeFilter, plotFilter])

  const showLordBonus = includeLordBonus && !isLarissa && lord !== null

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        {/* Lord bonus + scarcity toggles */}
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-parchment/80">
            <input
              type="checkbox"
              checked={includeLordBonus}
              onChange={e => setIncludeLordBonus(e.target.checked)}
              className="accent-gold"
            />
            Include lord bonus
          </label>

          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setUseCurrentScarcity(true)}
              className={[
                'px-2 py-1 text-xs rounded border transition-colors',
                useCurrentScarcity
                  ? 'bg-gold/20 border-gold/60 text-gold'
                  : 'border-light-purple/40 text-parchment/50 hover:text-parchment/70',
              ].join(' ')}
            >
              Current scarcity
            </button>
            <button
              onClick={() => setUseCurrentScarcity(false)}
              className={[
                'px-2 py-1 text-xs rounded border transition-colors',
                !useCurrentScarcity
                  ? 'bg-gold/20 border-gold/60 text-gold'
                  : 'border-light-purple/40 text-parchment/50 hover:text-parchment/70',
              ].join(' ')}
            >
              All Normal
            </button>
          </div>
        </div>

        {/* Expansion filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setExpansionFilter('base')}
            className={[
              'px-2 py-1 text-xs rounded border transition-colors',
              expansionFilter === 'base'
                ? 'bg-gold/20 border-gold/60 text-gold'
                : 'border-light-purple/40 text-parchment/50 hover:text-parchment/70',
            ].join(' ')}
          >
            Base Only
          </button>
          <button
            onClick={() => setExpansionFilter('all')}
            className={[
              'px-2 py-1 text-xs rounded border transition-colors',
              expansionFilter === 'all'
                ? 'bg-gold/20 border-gold/60 text-gold'
                : 'border-light-purple/40 text-parchment/50 hover:text-parchment/70',
            ].join(' ')}
          >
            Base + Undermountain
          </button>
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1">
          {ALL_QUEST_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={[
                'px-2 py-1 text-xs rounded border transition-colors',
                typeFilter === t
                  ? t === 'all'
                    ? 'bg-parchment/20 border-parchment/60 text-parchment'
                    : `border ${QUEST_TYPE_CHIP[t as QuestType]} opacity-100`
                  : 'border-light-purple/30 text-parchment/40 hover:text-parchment/70',
              ].join(' ')}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        {/* Plot filter */}
        <div className="flex gap-1">
          {(['all', 'plot', 'regular'] as const).map(f => (
            <button
              key={f}
              onClick={() => setPlotFilter(f)}
              className={[
                'px-2 py-1 text-xs rounded border transition-colors',
                plotFilter === f
                  ? 'bg-gold/20 border-gold/60 text-gold'
                  : 'border-light-purple/30 text-parchment/40 hover:text-parchment/70',
              ].join(' ')}
            >
              {f === 'all' ? 'All Quests' : f === 'plot' ? 'Plot Only' : 'Regular Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Larissa note */}
      {isLarissa && (
        <p className="text-xs text-parchment/50 bg-mid-purple/40 border border-light-purple/30 rounded px-3 py-2 italic">
          Your lord scores from Buildings, not Quests — rankings reflect base value only.
        </p>
      )}

      {/* Quest count */}
      <p className="text-xs text-parchment/40">
        Showing {filtered.length} of {ranked.length} quests
      </p>

      {/* Quest list */}
      <ol className="space-y-1.5">
        {filtered.map(r => (
          <QuestRow
            key={r.quest.id}
            ranked={r}
            maxScore={maxScore}
            showLordBonus={showLordBonus}
          />
        ))}
      </ol>
    </div>
  )
}
