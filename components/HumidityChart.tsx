'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip } from 'recharts'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Measurement } from '@/lib/supabase'

type Props = { data: Measurement[] }

function fmtTick(v: string) {
  try { return format(new Date(v), 'dd MMM HH:mm', { locale: pl }) } catch { return v }
}

function subsample<T>(arr: T[], max: number): T[] {
  if (arr.length <= max) return arr
  const step = Math.ceil(arr.length / max)
  return arr.filter((_, i) => i % step === 0)
}

export default function HumidityChart({ data }: Props) {
  const chartData = subsample(
    data.map(m => ({ time: m.created_at, hum: +m.humidity.toFixed(1) })), 200
  )

  return (
    <div className="rounded-xl border border-[var(--color-border)]
      bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-[var(--color-text-muted)]
        uppercase tracking-wide mb-4">
        Wilgotność (%)
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#006494" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#006494" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #d4d1ca)" />
          <XAxis dataKey="time" tickFormatter={fmtTick} minTickGap={60}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted, #7a7974)' }}
            tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted, #7a7974)' }}
            tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
          <Tooltip contentStyle={{ background: 'var(--color-surface)',
            border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: 12 }}
            labelFormatter={v => fmtTick(v as string)}
            formatter={v => [`${v}%`, 'Wilgotność']} />
          <Area type="monotone" dataKey="hum" stroke="#006494" strokeWidth={2}
            fill="url(#humGrad)" dot={false} activeDot={{ r: 4 }} animationDuration={600} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}