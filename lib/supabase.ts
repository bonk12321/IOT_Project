import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Measurement = {
  id: number
  created_at: string
  temperature: number
  humidity: number
  device_id: string
}

export type TimeRange = '24h' | '7d' | '30d'

export async function fetchMeasurements(range: TimeRange = '24h', deviceId?: string) {
  const hoursMap: Record<TimeRange, number> = {
    '24h': 24,
    '7d': 168,
    '30d': 720,
  }

  const since = new Date(
    Date.now() - hoursMap[range] * 60 * 60 * 1000
  ).toISOString()

  let query = supabase
    .from('measurements')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: true })

  if (deviceId && deviceId !== 'all') {
    query = query.eq('device_id', deviceId)
  }

  const { data, error } = await query.limit(500)
  if (error) throw error
  return data as Measurement[]
}

export async function fetchDevices(): Promise<string[]> {
  const { data, error } = await supabase
    .from('measurements')
    .select('device_id')

  if (error) throw error
  const unique = [...new Set((data ?? []).map((r) => r.device_id))]
  return unique
}