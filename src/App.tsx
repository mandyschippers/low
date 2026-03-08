import { useState } from 'react'
import type { Lord, ScarcityMap, ResourceType, ScarcityLevel } from './types'
import { LORDS } from './data/lords'
import { LordSelector } from './components/LordSelector'
import { ResourcePanel } from './components/ResourcePanel'
import { StrategyDisplay } from './components/StrategyDisplay'
import { QuestRanker } from './components/QuestRanker'
import { TabNav } from './components/TabNav'
import { computeStrategy } from './engine/strategy'

const DEFAULT_SCARCITY: ScarcityMap = {
  fighters: 'normal',
  rogues: 'normal',
  clerics: 'normal',
  wizards: 'normal',
  gold: 'normal',
}

export default function App() {
  const [selectedLord, setSelectedLord] = useState<Lord>(LORDS[0])
  const [scarcity, setScarcity] = useState<ScarcityMap>(DEFAULT_SCARCITY)
  const [activeTab, setActiveTab] = useState<'strategy' | 'ranker'>('strategy')

  function handleScarcityChange(resource: ResourceType, level: ScarcityLevel) {
    setScarcity(prev => ({ ...prev, [resource]: level }))
  }

  const report = computeStrategy(selectedLord, scarcity)

  return (
    <div className="min-h-screen bg-deep-purple text-parchment">
      {/* Header */}
      <header className="border-b border-light-purple/40 px-6 py-4">
        <h1 className="text-gold text-xl font-bold tracking-wide">Lords of Waterdeep</h1>
        <p className="text-parchment/60 text-xs tracking-widest uppercase mt-0.5">Strategy Advisor</p>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6">

        {/* Left panel — inputs */}
        <aside className="space-y-2">
          <div className="bg-mid-purple/60 border border-light-purple/50 rounded-lg px-4 py-5">
            <LordSelector selected={selectedLord} onChange={setSelectedLord} />
            <ResourcePanel scarcity={scarcity} onChange={handleScarcityChange} />
            <button
              onClick={() => setScarcity(DEFAULT_SCARCITY)}
              className="w-full text-xs text-parchment/40 hover:text-parchment/70 transition-colors mt-1 py-1"
            >
              Reset all to Normal
            </button>
          </div>

          <div className="bg-mid-purple/30 border border-light-purple/30 rounded-lg px-4 py-3">
            <p className="text-parchment/50 text-xs leading-relaxed">
              Set resource availability to reflect current game conditions. Scarce = heavily contested or few buildings producing it. Abundant = easy to acquire this round.
            </p>
          </div>
        </aside>

        {/* Right panel */}
        <main className="bg-mid-purple/40 border border-light-purple/40 rounded-lg px-5 py-5">
          <div className="flex items-center justify-between mb-0">
            <TabNav
              tabs={[
                { id: 'strategy', label: 'Strategy Advisor' },
                { id: 'ranker', label: 'Quest Ranker' },
              ]}
              active={activeTab}
              onChange={setActiveTab}
            />
            <span className="text-xs text-parchment/40 bg-deep-purple px-2 py-1 rounded border border-light-purple/30">
              {selectedLord.expansion === 'undermountain' ? 'Undermountain' : 'Base Game'}
            </span>
          </div>

          <div className="mt-5">
            {activeTab === 'strategy' && <StrategyDisplay report={report} />}
            {activeTab === 'ranker' && <QuestRanker lord={selectedLord} scarcity={scarcity} />}
          </div>
        </main>

      </div>
    </div>
  )
}
