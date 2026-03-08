import type { Lord, ScarcityMap, StrategyReport, QuestType, ResourceType, ScarcityLevel } from '../types'
import { RESOURCE_BUILDINGS, QUEST_PRIMARY_RESOURCE } from '../data/gameData'

function isScarce(level: ScarcityLevel) { return level === 'scarce' }
function isAbundant(level: ScarcityLevel) { return level === 'abundant' }

function resourceLabel(r: ResourceType): string {
  return { fighters: 'Fighters', rogues: 'Rogues', clerics: 'Clerics', wizards: 'Wizards', gold: 'Gold' }[r]
}

function questLabel(q: QuestType): string { return q }

function topBuildingsForResource(resource: ResourceType, priority: 'high' | 'medium'): { name: string; reason: string; priority: 'high' | 'medium' | 'low' }[] {
  return (RESOURCE_BUILDINGS[resource] ?? []).slice(0, 2).map(name => ({
    name,
    reason: `Provides ${resourceLabel(resource)} — key resource for your lord's quests`,
    priority,
  }))
}

export function computeStrategy(lord: Lord, scarcity: ScarcityMap): StrategyReport {
  const warnings: string[] = []
  const opportunities: string[] = []
  const buildingTargets: { name: string; reason: string; priority: 'high' | 'medium' | 'low' }[] = []

  // --- Larissa Neathal: building-focused lord ---
  if (lord.scoring.kind === 'buildings') {
    const goldStatus = scarcity.gold

    if (isScarce(goldStatus)) {
      warnings.push('Gold is scarce — buildings cost gold, so your core strategy is under pressure. Prioritize Aurora\'s Realms Shop and gold-generating action spaces every round.')
    } else if (isAbundant(goldStatus)) {
      opportunities.push('Gold is abundant — perfect conditions for Larissa. Buy buildings aggressively from round 1.')
    }

    buildingTargets.push(
      { name: 'Builder\'s Hall', reason: 'Your primary action space — use every round to acquire buildings for VP', priority: 'high' },
      { name: 'The Stone House', reason: 'Generates gold per building in play, snowballing your purchasing power', priority: 'high' },
      { name: 'Aurora\'s Realms Shop', reason: 'Consistent gold income to fund building purchases', priority: 'medium' },
    )

    return {
      lord,
      questPriorities: [
        { type: 'any', rationale: 'Quests are secondary for Larissa — complete them opportunistically for immediate VP, but buildings are your main scoring engine.' },
      ],
      resourcePriorities: [
        { resource: 'gold', rationale: 'Gold is your most important resource — it fuys buildings. Take gold every time you lack for building purchases.' },
      ],
      buildingTargets,
      warnings,
      opportunities: [
        ...opportunities,
        'Each building you own is worth 6 VP — 9 buildings matches a lord with 6 dual-type quests completed.',
        'Deny opponent buildings by purchasing before them, even buildings you wouldn\'t otherwise prioritize.',
      ],
      lordTip: 'Aim to own 7–9 buildings by game end. Buy early, buy often. Opponent buildings you block have double value — they deny them 6 VP while potentially giving you an action advantage.',
    }
  }

  // --- Danilo Thann: volume/all-quests lord ---
  if (lord.scoring.kind === 'all-quests') {
    if (isScarce(scarcity.gold)) {
      warnings.push('Gold is scarce — many quests have gold supplemental costs. Prioritize Aurora\'s Realms Shop to maintain quest completion pace.')
    }

    const allResources: ResourceType[] = ['fighters', 'rogues', 'clerics', 'wizards', 'gold']
    const abundantResources = allResources.filter(r => isAbundant(scarcity[r]))
    const scarceResources = allResources.filter(r => isScarce(scarcity[r]))

    if (abundantResources.length > 0) {
      opportunities.push(`${abundantResources.map(resourceLabel).join(', ')} ${abundantResources.length > 1 ? 'are' : 'is'} abundant — seek quests that cost mostly these resources for maximum efficiency.`)
    }

    if (scarceResources.length > 0) {
      warnings.push(`${scarceResources.map(resourceLabel).join(', ')} ${scarceResources.length > 1 ? 'are' : 'is'} scarce — avoid quests that heavily require these resources. You lose more turns than the 3 VP bonus is worth.`)
    }

    buildingTargets.push(
      { name: 'Cliffwatch Inn', reason: 'Maximise quest selection — more quest cards = more low-cost quests to cherry-pick', priority: 'high' },
      { name: 'Waterdeep Harbor', reason: 'Intrigue cards can accelerate quest completion or disrupt opponents slowing you down', priority: 'medium' },
    )

    // Add buildings for abundant resources
    abundantResources.slice(0, 2).forEach(r => {
      topBuildingsForResource(r, 'medium').slice(0, 1).forEach(b => buildingTargets.push(b))
    })

    return {
      lord,
      questPriorities: [
        { type: 'any', rationale: 'Any non-mandatory quest scores for Danilo. Prioritize quests requiring abundant resources. Avoid quests whose resources are scarce.' },
      ],
      resourcePriorities: allResources
        .sort((a, b) => {
          const order: Record<ScarcityLevel, number> = { abundant: 0, normal: 1, scarce: 2 }
          return order[scarcity[a]] - order[scarcity[b]]
        })
        .map(r => ({ resource: r, rationale: `Status: ${scarcity[r]}` })),
      buildingTargets,
      warnings,
      opportunities,
      lordTip: 'Speed is everything for Danilo. Aim to complete 8–10 quests. Each mandatory quest wasted costs you 3 VP — try to avoid receiving them, or complete them quickly with cheap resources.',
    }
  }

  // --- Trobriand: high-value quest specialist ---
  if (lord.scoring.kind === 'high-value-quests') {
    warnings.push('Only quests worth 10+ VP count for your bonus — never complete a low-value quest just to "complete a quest". Be patient.')

    const allResources: ResourceType[] = ['fighters', 'rogues', 'clerics', 'wizards', 'gold']
    const scarceResources = allResources.filter(r => isScarce(scarcity[r]))
    const abundantResources = allResources.filter(r => isAbundant(scarcity[r]))

    if (scarceResources.length > 0) {
      warnings.push(`${scarceResources.map(resourceLabel).join(', ')} ${scarceResources.length > 1 ? 'are' : 'is'} scarce — high-value quests tend to cost more of everything. Hoard these resources patiently before completing quests.`)
    }

    if (abundantResources.length > 0) {
      opportunities.push(`${abundantResources.map(resourceLabel).join(', ')} ${abundantResources.length > 1 ? 'are' : 'is'} abundant — look for high-VP quests that use these resources.`)
    }

    buildingTargets.push(
      { name: 'Cliffwatch Inn', reason: 'More quest selection = better chance of finding 10+ VP quests worth taking', priority: 'high' },
      { name: 'Tower of the Order', reason: 'Accumulates Wizards — powerful for completing high-cost Arcana quests', priority: 'medium' },
      { name: 'Spires of the Morning', reason: 'Accumulates Clerics — useful for high-cost Piety quests', priority: 'medium' },
    )

    return {
      lord,
      questPriorities: [
        { type: 'any', rationale: 'Target only quests worth 10+ VP. These are typically multi-resource quests. Hoard resources until a qualifying quest appears.' },
      ],
      resourcePriorities: allResources
        .sort((a, b) => {
          const order: Record<ScarcityLevel, number> = { abundant: 0, normal: 1, scarce: 2 }
          return order[scarcity[a]] - order[scarcity[b]]
        })
        .map(r => ({ resource: r, rationale: `Status: ${scarcity[r]} — ${scarcity[r] === 'scarce' ? 'hoard carefully' : scarcity[r] === 'abundant' ? 'easier to gather at scale' : 'gather steadily'}` })),
      buildingTargets,
      warnings,
      opportunities,
      lordTip: 'Trobriand rewards patience. Each qualifying quest nets 15+ VP (base reward + 5 bonus). 5 such quests = 75+ VP, often enough to win. Don\'t rush low-value quests — they waste your agent turns.',
    }
  }

  // --- Halaster: Undermountain specialist ---
  if (lord.scoring.kind === 'undermountain') {
    buildingTargets.push(
      { name: 'Undermountain buildings (expansion)', reason: 'Each Undermountain building you own scores 4 VP — buy them before opponents', priority: 'high' },
      { name: 'Builder\'s Hall', reason: 'Access to building purchases — critical to securing Undermountain buildings', priority: 'high' },
    )

    const allResources: ResourceType[] = ['fighters', 'rogues', 'clerics', 'wizards', 'gold']
    allResources.filter(r => isScarce(scarcity[r])).forEach(r => {
      warnings.push(`${resourceLabel(r)} is scarce — Undermountain quests have high resource costs. Contest the ${RESOURCE_BUILDINGS[r]?.[0] ?? 'relevant building'} action space early.`)
    })
    allResources.filter(r => isAbundant(scarcity[r])).forEach(r => {
      opportunities.push(`${resourceLabel(r)} is abundant — seek Undermountain quests with high ${resourceLabel(r)} costs for maximum efficiency.`)
    })

    return {
      lord,
      questPriorities: [
        { type: 'Undermountain', rationale: 'Undermountain quests score you 4 VP each AND can be worth up to 40 VP base — double value for Halaster.' },
        { type: 'any', rationale: 'Non-Undermountain quests are worth completing for base VP only — secondary priority.' },
      ],
      resourcePriorities: allResources
        .sort((a, b) => {
          const order: Record<ScarcityLevel, number> = { abundant: 0, normal: 1, scarce: 2 }
          return order[scarcity[a]] - order[scarcity[b]]
        })
        .map(r => ({ resource: r, rationale: `Status: ${scarcity[r]}` })),
      buildingTargets,
      warnings,
      opportunities,
      lordTip: 'Prioritize Undermountain buildings in the first 3 rounds — opponents may not realize your intent until too late. Each one you deny them is double value.',
    }
  }

  // --- Dual-quest lords (majority of lords) ---
  const scoring = lord.scoring as { kind: 'dual-quest'; types: [QuestType, QuestType]; vpPerQuest: number }
  const [type1, type2] = scoring.types

  const primaryResources: ResourceType[] = []
  const res1 = QUEST_PRIMARY_RESOURCE[type1]
  const res2 = QUEST_PRIMARY_RESOURCE[type2]
  if (res1) primaryResources.push(res1)
  if (res2 && res2 !== res1) primaryResources.push(res2)

  const allResources: ResourceType[] = ['fighters', 'rogues', 'clerics', 'wizards', 'gold']
  const nonPrimaryResources = allResources.filter(r => !primaryResources.includes(r))

  // Warnings: primary resources that are scarce
  primaryResources.forEach(r => {
    if (isScarce(scarcity[r])) {
      const buildings = RESOURCE_BUILDINGS[r]?.slice(0, 2).join(' and ') ?? 'key buildings'
      warnings.push(`${resourceLabel(r)} is scarce — your ${questLabel(r === res1 ? type1 : type2)} quests depend on it. Contest ${buildings} aggressively from round 1.`)
    }
  })

  // Opportunities: primary resources that are abundant
  primaryResources.forEach(r => {
    if (isAbundant(scarcity[r])) {
      opportunities.push(`${resourceLabel(r)} is abundant — your ${questLabel(r === res1 ? type1 : type2)} quests will be cheap to complete. Aim for high quest volume.`)
    }
  })

  // Opportunities: non-primary resources that are scarce (opponents waste turns on them)
  nonPrimaryResources.forEach(r => {
    if (isScarce(scarcity[r])) {
      opportunities.push(`${resourceLabel(r)} is scarce and you don't need it — opponents chasing those quest types will waste valuable agent turns fighting over it.`)
    }
  })

  // Buildings
  primaryResources.forEach(r => {
    if (isScarce(scarcity[r])) {
      topBuildingsForResource(r, 'high').forEach(b => buildingTargets.push(b))
    } else {
      topBuildingsForResource(r, 'medium').forEach(b => buildingTargets.push(b))
    }
  })

  // Gold building always useful
  if (!primaryResources.includes('gold')) {
    if (isScarce(scarcity.gold)) {
      buildingTargets.push({ name: 'Aurora\'s Realms Shop', reason: 'Gold scarce — even non-Commerce lords need gold for building purchases and quest supplemental costs', priority: 'medium' })
    }
  }

  buildingTargets.push({ name: 'Cliffwatch Inn', reason: 'More quest options means faster access to your target quest types', priority: 'medium' })

  // Deduplicate buildings
  const seen = new Set<string>()
  const uniqueBuildings = buildingTargets.filter(b => {
    if (seen.has(b.name)) return false
    seen.add(b.name)
    return true
  })

  // Quest priorities
  const questPriorities: { type: QuestType | 'any'; rationale: string }[] = []

  // Determine which type to prioritize based on scarcity
  let firstType = type1
  let secondType = type2
  if (res1 && res2 && isScarce(scarcity[res1]) && !isScarce(scarcity[res2])) {
    // res2 is easier — prioritize it but still seek res1 early
  } else if (res1 && res2 && !isScarce(scarcity[res1]) && isScarce(scarcity[res2])) {
    firstType = type2
    secondType = type1
  }

  questPriorities.push({
    type: firstType,
    rationale: `${firstType} quests are your primary scoring type (${scoring.vpPerQuest} VP each). ${res1 && isAbundant(scarcity[res1]) ? resourceLabel(res1) + ' is abundant — push hard on these.' : ''}`,
  })
  questPriorities.push({
    type: secondType,
    rationale: `${secondType} quests also score ${scoring.vpPerQuest} VP each. Balance acquisition with ${firstType}.`,
  })

  // Resource priorities
  const resourcePriorities = [
    ...primaryResources.map(r => ({
      resource: r,
      rationale: `Needed for both ${type1} and ${type2} quests — ${scarcity[r] === 'scarce' ? 'SCARCE, secure early' : scarcity[r] === 'abundant' ? 'abundant, gather freely' : 'gather steadily'}`,
    })),
    ...nonPrimaryResources
      .filter(r => !isScarce(scarcity[r]))
      .map(r => ({ resource: r, rationale: `Not needed for your quest types — collect only if free to do so` })),
  ]

  const lordTips: Record<string, string> = {
    brianne: 'Arcana (Wizards) and Skullduggery (Rogues) are both specialist resources — secure Blackstaff Tower and Grinning Lion Tavern early. Intrigue card play from Skullduggery quests can disrupt opponents.',
    caladorn: 'Skullduggery gives you Intrigue card access while Warfare offers volume via abundant Fighters. Use intrigue to slow leaders and push Warfare quests in mid-game.',
    durnan: 'Commerce needs Gold + mixed adventurers — the most flexible lord. Warfare fills in when Gold is tight. Build a wide resource base.',
    kyriani: 'Both types need specialist resources (Wizards, Clerics). Contest Blackstaff Tower and The Plinth early. Tough in resource-scarce games, strong when resources flow freely.',
    khelben: 'Arcana and Warfare are a strong pairing — Wizards are scarce while Fighters are abundant. Complete Warfare quests for volume and Arcana quests for high individual VP.',
    mirt: 'Commerce and Piety complement each other — Gold from Commerce funds building purchases that produce Clerics for Piety. The Stone House and The Plinth synergize well.',
    nindil: 'Piety (Clerics) and Skullduggery (Rogues) are both specialist types. Get Intrigue card advantage from Skulldugery early to disrupt opponents, then grind Piety quests.',
    nymara: 'Commerce flexibility and Skullduggery disruption — a cunning combination. Use Intrigue from Skullduggery to attack players competing for Commerce resources.',
    piergeiron: 'Piety (Clerics) plus Warfare (Fighters, the most abundant resource) — strong late-game volume. Secure Clerics early, then flood Warfare quests in rounds 5–8.',
    sammereza: 'Arcana and Commerce demand different resources (Wizards vs Gold/mixed) — spread your resource gathering. Plot quests in both types can accelerate your engine significantly.',
  }

  return {
    lord,
    questPriorities,
    resourcePriorities,
    buildingTargets: uniqueBuildings,
    warnings,
    opportunities,
    lordTip: lordTips[lord.id] ?? `Focus on ${type1} and ${type2} quests. Each is worth ${scoring.vpPerQuest} VP — completing 6 of each is 48 VP from lord bonus alone.`,
  }
}
