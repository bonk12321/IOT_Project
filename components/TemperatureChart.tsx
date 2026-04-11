'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Measurement } from '@/lib/supabase'

type Props = { data: Measurement[]; threshold?: number }

function fmtTick(v: string) {
  try { return format(new Date(v), 'dd MMM HH:mm', { locale: pl }) } catch { return v }
}

function subsample<T>(arr: T[], max: number): T[] {
  if (arr.length <= max) return arr
  const step = Math.ceil(arr.length / max)
  return arr.filter((_, i) => i % step === 0)
}

export default function TemperatureChart({ data, threshold }: Props) {
  const chartData = subsample(
    data.map(m => ({ time: m.created_at, temp: +m.temperature.toFixed(1) })), 200
  )

  return (
    <div className="rounded-xl border border-[var(--color-border)]
      bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-[var(--color-text-muted)]
        uppercase tracking-wide mb-4">
        Temperatura (°C)
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #d4d1ca)" />
          <XAxis dataKey="time" tickFormatter={fmtTick} minTickGap={60}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted, #7a7974)' }}
            tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted, #7a7974)' }}
            tickLine={false} axisLine={false} unit="°" />
          <Tooltip contentStyle={{ background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: 12 }}
            labelFormatter={v => fmtTick(v as string)}
            formatter={v => [`${v}°C`, 'Temperatura']} />
          {threshold && (
            <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4"
              label={{ value: `Alert ${threshold}°C`, position: 'right',
                fontSize: 11, fill: '#ef4444' }} />
          )}
          <Line type="monotone" dataKey="temp" stroke="var(--color-primary, #01696f)"
            strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={600} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}