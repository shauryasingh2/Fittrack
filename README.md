# FitTrack

Mobile-first fitness tracker built with Next.js 14, React, Tailwind CSS and Supabase authentication.

## Included
- Responsive landing and Google OAuth login screens.
- Dashboard with overview, workout log, calorie/food diary, water log, steps, weight history, goals, progress charts and daily target settings.
- Real totals/charts are calculated from user-entered data; no generated fake activity is presented as real.
- When Supabase is not configured, the dashboard can be explored in local preview mode. Preview entries are stored in this browser only and are not synced to an account.

## Run locally
1. Install Node.js 18.17+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and enter your Supabase project URL and public anon key.
4. Run `npm run dev`, then open http://localhost:3000.

## Enable Google sign-in
1. In Supabase, open Authentication -> Providers -> Google and enable it.
2. Configure the Google OAuth client in Google Cloud Console with the callback URL shown by Supabase.
3. In Supabase Authentication URL Configuration, add your local and deployed app URLs to the allowed redirect URLs (e.g. `http://localhost:3000/dashboard` and your deployed `/dashboard` URL).
4. Ensure `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Restart the dev server after changing environment variables.

## Data note
The dashboard's activity entries currently use browser local storage. The included `supabase/schema.sql` defines starter tables and row-level security, but data persistence has not yet been connected to those tables. Do not treat preview entries as cloud-backed or synced between devices.
