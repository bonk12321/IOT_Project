'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggle = () => {
    setDark(prev => {
      document.documentElement.classList.toggle('dark', !prev)
      return !prev
    })
  }

  return (
    <button onClick={toggle}
      aria-label={dark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]
        p-2 hover:bg-[var(--color-surface-offset)] transition-colors
        text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}