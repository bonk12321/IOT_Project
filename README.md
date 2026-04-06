# IoT Climate Monitor 

System monitorowania temperatury i wilgotności w czasie rzeczywistym.

## Stack Technologiczny
- **Frontend/Backend:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **Hardware:** ESP32 + DHT22
- **Deployment:** Vercel

## Konfiguracja lokalna
1. Sklonuj repozytorium: `git clone [link-do-repo]`
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env.local` (skorzystaj z `.env.example`)
4. Uruchom projekt: `npm run dev`

## API Endpoint
`POST /api/sensor`
Body: `{ "temp": number, "hum": number, "device_id": string }`