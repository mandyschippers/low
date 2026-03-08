interface Tab<T extends string> {
  id: T
  label: string
}

interface Props<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
}

export function TabNav<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div className="flex gap-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            'px-3 py-2 text-sm font-medium transition-colors border-b-2',
            active === tab.id
              ? 'border-gold text-gold'
              : 'border-transparent text-parchment/50 hover:text-parchment/80',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
