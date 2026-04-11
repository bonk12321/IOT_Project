'use client'

import { useCallback, useEffect, useState } from 'react'
import { Thermometer, Droplets, Activity, Cpu } from 'lucide-react'
import { fetchMeasurements, fetchDevices, type Measurement, type TimeRange } from '@/lib/supabase'
import KpiCard from '@/components/KpiCard'
import TemperatureChart from '@/components/TemperatureChart'
import HumidityChart from '@/components/HumidityChart'
import DataTable from '@/components/DataTable'
import FilterBar from '@/components/FilterBar'
import AlertBar from '@/components/AlertBar'
import ThemeToggle from '@/components/ThemeToggle'

const ALERT_THRESHOLD = Number(process.env.NEXT_PUBLIC_ALERT_TEMP_THRESHOLD ?? 30)

function avg(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function calcDelta(curr: Measurement[], prev: Measurement[], key: 'temperature' | 'humidity') {
  const c = avg(curr.map((m) => m[key]))
  const p = avg(prev.map((m) => m[key]))
  if (!p) return undefined
  return ((c - p) / p) * 100
}

export default function DashboardPage() {
  const [data, setData] = useState<Measurement[]>([])
  const [devices, setDevices] = useState<string[]>([])
  const [range, setRange] = useState<TimeRange>('24h')
  const [device, setDevice] = useState('all')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [current, devList] = await Promise.all([
        fetchMeasurements(range, device === 'all' ? undefined : device),
        fetchDevices(),
      ])
      setData(current)
      setDevices(devList)
      setLastUpdated(new Date())
    } catch {
      setError('Nie można pobrać danych. Sprawdź konfigurację Supabase w .env.local')
    } finally {
      setLoading(false)
    }
  }, [range, device])

  useEffect(() => { load() }, [load])

  // Auto-refresh co 60s
  useEffect(() => {
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [load])

  const mid = Math.ceil(data.length / 2)
  const currHalf = data.slice(mid)
  const prevHalf = data.slice(0, mid)

  const latest = data.at(-1)
  const latestTemp = latest?.temperature ?? null
  const latestHum = latest?.humidity ?? null
  const latestDevice = latest?.device_id ?? '—'
  const hasAlert = latestTemp !== null && latestTemp > ALERT_THRESHOLD

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)]
        bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none"
              aria-label="IoT Dashboard logo" className="text-[var(--color-primary)]">
              <rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="16" y="2" width="10" height="10" rx="2" fill="currentColor" opacity="0.5"/>
              <rect x="2" y="16" width="10" height="10" rx="2" fill="currentColor" opacity="0.5"/>
              <circle cx="21" cy="21" r="5" fill="currentColor"/>
            </svg>
            <span className="font-semibold tracking-tight">IoT Dashboard</span>
            <span className="hidden sm:inline text-xs text-[var(--color-text-muted)] border
              border-[var(--color-border)] rounded-full px-2 py-0.5">
              Monitoring atmosferyczny
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasAlert && (
              <span className="text-xs font-medium text-red-600 dark:text-red-400
                bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-700
                rounded-full px-2.5 py-0.5 animate-pulse">
                ⚠ Alert temperatury
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {hasAlert && latestTemp !== null && (
          <AlertBar temperature={latestTemp} threshold={ALERT_THRESHOLD} deviceId={latestDevice} />
        )}

        {error && (
          <div className="rounded-xl border border-red-300 dark:border-red-700
            bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <FilterBar
          range={range} onRangeChange={setRange}
          device={device} devices={devices} onDeviceChange={setDevice}
          onRefresh={load} loading={loading} lastUpdated={lastUpdated}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard label="Aktualna temperatura" value={latestTemp?.toFixed(1) ?? '—'}
            unit="°C" delta={calcDelta(currHalf, prevHalf, 'temperature')}
            icon={<Thermometer size={18} />} alert={hasAlert} />
          <KpiCard label="Aktualna wilgotność" value={latestHum?.toFixed(1) ?? '—'}
            unit="%" delta={calcDelta(currHalf, prevHalf, 'humidity')}
            icon={<Droplets size={18} />} />
          <KpiCard label={`Śr. temp (${range})`}
            value={data.length ? avg(data.map(m => m.temperature)).toFixed(1) : '—'}
            unit="°C" icon={<Activity size={18} />} />
          <KpiCard label="Pomiarów w zakresie" value={data.length}
            icon={<Cpu size={18} />} />
        </div>

        {/* Charts & Table */}
        {loading && !data.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[0, 1].map(i => (
              <div key={i} className="rounded-xl border border-[var(--color-border)]
                bg-[var(--color-surface)] h-[280px] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <TemperatureChart data={data} threshold={ALERT_THRESHOLD} />
              <HumidityChart data={data} />
            </div>
            <DataTable data={data} threshold={ALERT_THRESHOLD} />
          </>
        )}
      </main>

      <footer className="border-t border-[var(--color-border)] py-4 text-center
        text-xs text-[var(--color-text-muted)]">
        IoT Dashboard · ESP32 + Supabase + Next.js · Auto-refresh co 60s
      </footer>
    </div>
  )
}