'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

type Props = {
  temperature: number
  threshold: number
  deviceId: string
}

export default function AlertBar({ temperature, threshold, deviceId }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || temperature <= threshold) return null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-400
      dark:border-red-700 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm
      text-red-700 dark:text-red-300">
      <AlertTriangle size={16} className="shrink-0" />
      <span className="flex-1">
        <strong>Uwaga!</strong> Temperatura na urządzeniu{' '}
        <code className="font-mono">{deviceId}</code> wynosi{' '}
        <strong>{temperature.toFixed(1)}°C</strong> — próg alertu to {threshold}°C.
      </span>
      <button onClick={() => setDismissed(true)}
        className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Zamknij alert">
        <X size={14} />
      </button>
    </div>
  )
}