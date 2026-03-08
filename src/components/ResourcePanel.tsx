import type { ResourceType, ScarcityLevel, ScarcityMap } from '../types'
import { RESOURCE_LABELS, RESOURCE_DOT_COLORS } from '../data/gameData'

interface Props {
  scarcity: ScarcityMap
  onChange: (resource: ResourceType, level: ScarcityLevel) => void
}

const LEVELS: ScarcityLevel[] = ['scarce', 'normal', 'abundant']

const LEVEL_LABELS: Record<ScarcityLevel, string> = {
  scarce: 'Scarce',
  normal: 'Normal',
  abundant: 'Abundant',
}

const LEVEL_STYLES: Record<ScarcityLevel, string> = {
  scarce: 'bg-red-800 border-red-500 text-red-100',
  normal: 'bg-gray-700 border-gray-500 text-gray-200',
  abundant: 'bg-green-800 border-green-500 text-green-100',
}

const LEVEL_ACTIVE_STYLES: Record<ScarcityLevel, string> = {
  scarce: 'ring-2 ring-red-400',
  normal: 'ring-2 ring-gray-300',
  abundant: 'ring-2 ring-green-400',
}

const RESOURCES: ResourceType[] = ['fighters', 'rogues', 'clerics', 'wizards', 'gold']

export function ResourcePanel({ scarcity, onChange }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-gold-light text-xs uppercase tracking-widest mb-3 font-semibold">
        Resource Availability
      </label>
      <div className="space-y-2">
        {RESOURCES.map(resource => (
          <div key={resource} className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-36 flex-shrink-0">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                style={{ backgroundColor: RESOURCE_DOT_COLORS[resource] }}
              />
              <span className="text-parchment text-sm font-medium">{RESOURCE_LABELS[resource]}</span>
            </div>
            <div className="flex gap-1 flex-1 min-w-0">
              {LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => onChange(resource, level)}
                  className={`
                    flex-1 min-w-0 py-1 px-2 rounded border text-xs font-medium transition-all truncate
                    ${LEVEL_STYLES[level]}
                    ${scarcity[resource] === level ? LEVEL_ACTIVE_STYLES[level] : 'opacity-40 hover:opacity-70'}
                  `}
                >
                  {LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
