'use client'

type Props = {
  label: string
  value: string | number
  unit?: string
  delta?: number
  icon?: React.ReactNode
  alert?: boolean
}

const TrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const TrendDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)
const Dash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export default function KpiCard({ label, value, unit, delta, icon, alert }: Props) {
  const deltaColor = delta === undefined ? '' :
    delta > 0 ? 'text-green-600 dark:text-green-400' :
    delta < 0 ? 'text-red-500 dark:text-red-400' : 'text-[var(--color-text-muted)]'

  const DeltaIcon = delta === undefined ? null :
    delta > 0 ? TrendUp : delta < 0 ? TrendDown : Dash

  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 shadow-sm transition-all
      ${alert
        ? 'border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-700'
        : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          {label}
        </span>
        {icon && (
          <span className={`opacity-60 ${alert ? 'text-red-500' : 'text-[var(--color-primary)]'}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-3xl font-bold tabular-nums leading-none
          ${alert ? 'text-red-600 dark:text-red-400' : 'text-[var(--color-text)]'}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-[var(--color-text-muted)] mb-0.5">{unit}</span>}
      </div>
      {DeltaIcon && delta !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
          <DeltaIcon />
          <span>{delta > 0 ? '+' : ''}{delta.toFixed(1)}% vs poprzedni okres</span>
        </div>
      )}
    </div>
  )
}