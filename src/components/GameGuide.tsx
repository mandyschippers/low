export function GameGuide() {
  return (
    <div className="space-y-6">

      {/* Lord Tiers */}
      <section>
        <h3 className="text-gold text-xs uppercase tracking-widest mb-3 font-semibold">
          Lord Tier Rankings
        </h3>
        <div className="space-y-2">

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider mt-0.5 w-16 shrink-0">Strong</span>
              <div>
                <p className="text-parchment text-sm font-medium">Khelben, Piergeiron, Caladorn, Durnan</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Any lord with Warfare in their pairing. Fighters are the most abundant resource — Warfare quests chain efficiently.
                  Khelben (Arcana + Warfare) is the top pick: volume from Warfare, high VP from Arcana.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mt-0.5 w-16 shrink-0">Solid</span>
              <div>
                <p className="text-parchment text-sm font-medium">Trobriand, Danilo</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Trobriand has the highest ceiling (+5 per 10+ VP quest) but requires patience.
                  Danilo is flexible and forgiving (+3 any quest).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xs font-bold uppercase tracking-wider mt-0.5 w-16 shrink-0">Harder</span>
              <div>
                <p className="text-parchment text-sm font-medium">Brianne, Sammereza, Kyriani</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Heavy Wizard or dual-specialist dependence. Depend on Wizards (scarce) or two specialist resources simultaneously.
                  Strong when resources flow, fragile when contested.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-0.5 w-16 shrink-0">Unique</span>
              <div>
                <p className="text-parchment text-sm font-medium">Larissa, Halaster</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Entirely different win conditions (buildings / Undermountain).
                  Halaster needs early Undermountain building control.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Universal Plot Quests */}
      <section>
        <h3 className="text-gold text-xs uppercase tracking-widest mb-3 font-semibold">
          Plot Quests Worth Taking Regardless of Lord
        </h3>
        <div className="space-y-2">

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-parchment text-sm font-medium">Recruit Lieutenant</p>
                <p className="text-parchment/50 text-xs mt-0.5">4 Fighters + 2 Gold</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Extra agent for the rest of the game. Game-breaking regardless of lord — more actions = more everything.
                </p>
              </div>
              <span className="text-green-400 text-xs font-bold shrink-0">Must-take</span>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-parchment text-sm font-medium">Consecrate the Temple</p>
                <p className="text-parchment/50 text-xs mt-0.5">2 Clerics + 2 Gold</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  +1 VP per quest completed. Scales with any quest-heavy strategy; cheap to unlock.
                </p>
              </div>
              <span className="text-green-400 text-xs font-bold shrink-0">Must-take</span>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-parchment text-sm font-medium">Raise the City Guard</p>
                <p className="text-parchment/50 text-xs mt-0.5">3 Fighters + 1 Gold</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  +2 Fighters at start of each round. Cheapest passive resource generation; useful even for non-Warfare lords since Fighters appear as secondary costs.
                </p>
              </div>
              <span className="text-yellow-400 text-xs font-bold shrink-0">Strong</span>
            </div>
          </div>

          <div className="bg-mid-purple/60 border border-light-purple/40 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-parchment text-sm font-medium">Uncover the Darkhold Conspiracy</p>
                <p className="text-parchment/50 text-xs mt-0.5">2 Wizards + 2 Gold</p>
                <p className="text-parchment/60 text-xs mt-1 leading-relaxed">
                  Draw 1 extra card at Cliffwatch Inn. Selection advantage compounds over the game; worth it for any quest-heavy strategy.
                </p>
              </div>
              <span className="text-yellow-400 text-xs font-bold shrink-0">Strong</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
