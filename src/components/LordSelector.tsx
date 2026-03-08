import type { Lord } from '../types'
import { LORDS } from '../data/lords'

interface Props {
  selected: Lord
  onChange: (lord: Lord) => void
}

export function LordSelector({ selected, onChange }: Props) {
  const baseLords = LORDS.filter(l => l.expansion === 'base')
  const undermountainLords = LORDS.filter(l => l.expansion === 'undermountain')

  return (
    <div className="mb-6">
      <label className="block text-gold-light text-xs uppercase tracking-widest mb-2 font-semibold">
        Your Lord Card
      </label>
      <select
        value={selected.id}
        onChange={e => {
          const lord = LORDS.find(l => l.id === e.target.value)
          if (lord) onChange(lord)
        }}
        className="w-full bg-mid-purple border border-light-purple text-parchment rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
      >
        <optgroup label="Base Game">
          {baseLords.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </optgroup>
        <optgroup label="Undermountain Expansion">
          {undermountainLords.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </optgroup>
      </select>

      <div className="mt-3 px-3 py-2 bg-deep-purple border border-light-purple rounded text-sm text-parchment opacity-90">
        <span className="text-gold font-semibold">Scoring: </span>
        {selected.bonusDescription}
      </div>
    </div>
  )
}
