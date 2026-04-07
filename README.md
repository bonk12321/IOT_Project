# 🛰️ IoT Dashboard – Fullstack Next.js & ESP32
Projekt systemu monitorowania warunków atmosferycznych. Dane płyną z fizycznego czujnika przez API do bazy danych, a następnie są wizualizowane na dashboardzie.

# 🏗️ Struktura Projektu
/ (root) – Aplikacja Next.js (Frontend & API Backend).

/firmware – Kod C++ dla ESP32 (PlatformIO). Uwaga: Deweloperzy webowi nie muszą kompilować tego kodu, służy on jako dokumentacja przepływu danych.

# 🛠️ Setup dla Developerów (Frontend & Backend)
1. Wymagania
Node.js (v18.0 lub nowszy)

npm lub yarn

2. Instalacja
Sklonuj repozytorium i zainstaluj zależności w głównym folderze:

Bash
npm install
3. Konfiguracja Środowiska (.env)
W głównym folderze utwórz plik .env.local. Musisz tam wpisać klucze dostępowe do naszej instancji Supabase.

Klucze pobierzesz od Lidera Projektu lub z panelu Supabase (Settings -> API).

Code-Snippet
NEXT_PUBLIC_SUPABASE_URL=twoj_url_projektu
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_klucz_anonimowy
SUPABASE_SERVICE_ROLE_KEY=twoj_klucz_serwisowy
4. Uruchomienie lokalne
Bash
npm run dev
Aplikacja będzie dostępna pod adresem http://localhost:3000.

# 📊 Przepływ Danych (Data Flow)
Abyście wiedzieli, co renderujecie, oto jak dane trafiają do systemu:

Ingest: Urządzenie wysyła POST na /api/sensor z body:

JSON
{ "temp": 24.5, "hum": 55.2, "device_id": "ESP32_STACJA_1" }
Storage: API zapisuje te dane w tabeli measurements w Supabase.

Visualization: Wy używacie supabase-js, aby pobrać te rekordy i wyświetlić je w komponentach Reactowych.

# 🤝 Kooperacja i Narzędzia
Supabase (Database & Auth)
Korzystamy ze wspólnej instancji bazy.

Dostęp: Poproś Lidera o zaproszenie do organizacji w Supabase.

Tabela: measurements (kolumny: id, created_at, temperature, humidity, device_id).

Vercel (Deployment)
Deployment odbywa się automatycznie po każdym git push na branch main.

Preview projektu: https://iot-project-rouge.vercel.app

GitHub Workflow
Nie wypychajcie zmian bezpośrednio do main (chyba że to drobne poprawki w tekście).

Twórzcie branche: feature/moje-ulepszenie.

Przed zakończeniem pracy zrób git pull --rebase, aby uniknąć konfliktów.

# 🚀 Zadania do zrobienia (Backlog)
[ ] Dodanie wykresów liniowych (np. Chart.js lub Recharts).

[ ] Implementacja filtrowania danych (ostatnie 24h, 7 dni).

[ ] System powiadomień, gdy temperatura przekroczy X stopni.

[ ] Tryb ciemny (Dark Mode) dla dashboardu.