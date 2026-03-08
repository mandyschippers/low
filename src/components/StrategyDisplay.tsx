import type { StrategyReport } from '../types'
import { RESOURCE_DOT_COLORS, RESOURCE_LABELS } from '../data/gameData'

interface Props {
  report: StrategyReport
}

const QUEST_COLORS: Record<string, string> = {
  Arcana: 'text-purple-300',
  Commerce: 'text-yellow-300',
  Piety: 'text-blue-300',
  Skullduggery: 'text-gray-300',
  Warfare: 'text-orange-300',
  Undermountain: 'text-teal-300',
  any: 'text-parchment',
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-red-900 text-red-200 border border-red-600',
  medium: 'bg-yellow-900 text-yellow-200 border border-yellow-600',
  low: 'bg-gray-800 text-gray-300 border border-gray-600',
}

export function StrategyDisplay({ report }: Props) {
  const { questPriorities, resourcePriorities, buildingTargets, warnings, opportunities, lordTip } = report

  return (
    <div className="space-y-5">

      {/* Warnings */}
      {warnings.length > 0 && (
        <section>
          <h3 className="text-red-400 text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-1">
            <span>⚠</span> Scarcity Warnings
          </h3>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-sm text-red-200 bg-red-950/50 border border-red-800 rounded px-3 py-2">
                {w}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section>
          <h3 className="text-green-400 text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-1">
            <span>✓</span> Opportunities
          </h3>
          <ul className="space-y-1">
            {opportunities.map((o, i) => (
              <li key={i} className="text-sm text-green-200 bg-green-950/50 border border-green-800 rounded px-3 py-2">
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Quest Priorities */}
      <section>
        <h3 className="text-gold-light text-xs uppercase tracking-widest mb-2 font-semibold">
          Quest Priorities
        </h3>
        <ol className="space-y-2">
          {questPriorities.map((qp, i) => (
            <li key={i} className="flex gap-3 items-start bg-mid-purple/60 border border-light-purple/50 rounded px-3 py-2">
              <span className="text-gold font-bold text-sm w-5 flex-shrink-0">{i + 1}.</span>
              <div>
                <span className={`font-semibold text-sm ${QUEST_COLORS[qp.type] ?? 'text-parchment'}`}>
                  {qp.type === 'any' ? 'Any Quest Type' : `${qp.type} Quests`}
                </span>
                <p className="text-xs text-parchment/70 mt-0.5">{qp.rationale}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Resource Priorities */}
      <section>
        <h3 className="text-gold-light text-xs uppercase tracking-widest mb-2 font-semibold">
          Resource Priorities
        </h3>
        <ol className="space-y-1.5">
          {resourcePriorities.map((rp, i) => (
            <li key={i} className="flex gap-3 items-center text-sm">
              <span className="text-gold/60 font-bold w-5 flex-shrink-0 text-xs">{i + 1}.</span>
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                style={{ backgroundColor: RESOURCE_DOT_COLORS[rp.resource] }}
              />
              <span className="font-medium text-parchment w-20 flex-shrink-0">{RESOURCE_LABELS[rp.resource]}</span>
              <span className="text-parchment/60 text-xs">{rp.rationale}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Building Targets */}
      <section>
        <h3 className="text-gold-light text-xs uppercase tracking-widest mb-2 font-semibold">
          Key Buildings to Target
        </h3>
        <ul className="space-y-1.5">
          {buildingTargets.map((b, i) => (
            <li key={i} className="flex gap-3 items-start text-sm">
              <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-semibold mt-0.5 ${PRIORITY_BADGE[b.priority]}`}>
                {b.priority.toUpperCase()}
              </span>
              <div>
                <span className="text-parchment font-medium">{b.name}</span>
                <p className="text-parchment/60 text-xs">{b.reason}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Lord Tip */}
      <section className="border-t border-light-purple/40 pt-4">
        <h3 className="text-gold-light text-xs uppercase tracking-widest mb-2 font-semibold">
          Lord Strategy Summary
        </h3>
        <p className="text-sm text-parchment leading-relaxed bg-mid-purple/40 border border-gold/20 rounded px-3 py-2 italic">
          {lordTip}
        </p>
      </section>

    </div>
  )
}
