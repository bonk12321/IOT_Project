'use client'

import { RefreshCw } from 'lucide-react'
import type { TimeRange } from '@/lib/supabase'

type Props = {
  range: TimeRange
  onRangeChange: (r: TimeRange) => void
  device: string
  devices: string[]
  onDeviceChange: (d: string) => void
  onRefresh: () => void
  loading: boolean
  lastUpdated: Date | null
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: 'Ostatnie 24h', value: '24h' },
  { label: '7 dni', value: '7d' },
  { label: '30 dni', value: '30d' },
]

export default function FilterBar({
  range, onRangeChange, device, devices, onDeviceChange, onRefresh, loading, lastUpdated,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-sm">
        {RANGES.map(r => (
          <button key={r.value} onClick={() => onRangeChange(r.value)}
            className={`px-3 py-1.5 transition-colors
              ${range === r.value
                ? 'bg-[var(--color-primary)] text-white font-medium'
                : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)] text-[var(--color-text)]'
              }`}>
            {r.label}
          </button>
        ))}
      </div>

      <select value={device} onChange={e => onDeviceChange(e.target.value)}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
          px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none
          focus:ring-2 focus:ring-[var(--color-primary)]/40">
        <option value="all">Wszystkie urządzenia</option>
        {devices.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <button onClick={onRefresh} disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-border)]
          bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]
          hover:bg-[var(--color-surface-offset)] transition-colors disabled:opacity-50">
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        Odśwież
      </button>

      {lastUpdated && (
        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          Zaktualizowano: {lastUpdated.toLocaleTimeString('pl-PL')}
        </span>
      )}
    </div>
  )
}