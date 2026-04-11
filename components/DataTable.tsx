'use client'

import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Measurement } from '@/lib/supabase'

type Props = { data: Measurement[]; threshold?: number }

export default function DataTable({ data, threshold }: Props) {
  const rows = [...data].reverse().slice(0, 100)

  return (
    <div className="rounded-xl border border-[var(--color-border)]
      bg-[var(--color-surface)] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-xs font-semibold text-[var(--color-text-muted)]
          uppercase tracking-wide">
          Ostatnie pomiary
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]
              bg-[var(--color-surface-offset)]/50">
              {['Czas', 'Urządzenie', 'Temp (°C)', 'Wilg. (%)'].map(h => (
                <th key={h} className={`px-4 py-2.5 text-xs font-medium
                  text-[var(--color-text-muted)] uppercase tracking-wide
                  ${h.includes('Temp') || h.includes('Wilg') ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[var(--color-text-muted)]">
                  Brak danych w wybranym zakresie
                </td>
              </tr>
            ) : rows.map(m => {
              const isAlert = threshold && m.temperature > threshold
              return (
                <tr key={m.id} className={`border-b border-[var(--color-border)]
                  last:border-0 transition-colors
                  ${isAlert
                    ? 'bg-red-50/60 dark:bg-red-950/20'
                    : 'hover:bg-[var(--color-surface-offset)]/40'}`}>
                  <td className="px-4 py-2.5 text-[var(--color-text-muted)] tabular-nums">
                    {format(new Date(m.created_at), 'dd.MM HH:mm:ss', { locale: pl })}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">{m.device_id}</td>
                  <td className={`px-4 py-2.5 text-right font-medium tabular-nums
                    ${isAlert ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {m.temperature.toFixed(1)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {m.humidity.toFixed(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}