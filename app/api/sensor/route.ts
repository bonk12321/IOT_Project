import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Inicjalizacja bazy danymi z Twojego .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { temp, hum, device_id } = body

    // Wstawienie danych do Twojej tabeli w Supabase
    const { data, error } = await supabase
      .from('measurements') // upewnij się, że tak nazywa się Twoja tabela
      .insert([
        { 
          temperature: temp, 
          humidity: hum, 
          device_id: device_id || 'ESP32_UNKNOWN' 
        }
      ])

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Dane zapisane!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}