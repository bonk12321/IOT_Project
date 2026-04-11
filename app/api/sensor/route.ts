import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { temp, hum, device_id } = body

    // Walidacja
    if (temp === undefined || hum === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: temp, hum' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('measurements')
      .insert([{
        temperature: temp,
        humidity: hum,
        device_id: device_id || 'ESP32_UNKNOWN'
      }])

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Dane zapisane!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { temp, hum, device_id } = body

    // Walidacja
    if (temp === undefined || hum === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: temp, hum' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('measurements')
      .insert([{
        temperature: temp,
        humidity: hum,
        device_id: device_id || 'ESP32_UNKNOWN'
      }])

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Dane zapisane!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Sensor API is running ✅' })
}

export async function GET() {
  return NextResponse.json({ status: 'Sensor API is running ✅' })
}