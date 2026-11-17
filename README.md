# Project Chirag
1. Create a Supabase project, enable Anonymous sign-ins, run `supabase/schema.sql`, add your admin row.
2. `cp .env.example .env` and fill VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (anon key only).
3. `npm i && npm run dev` — quiz at `/`, admin at `/admin`.
At `/admin`, you can edit existing question and option text, hide or restore questions, and upload, replace, or remove photos for each option. Hidden questions are skipped in new and resumed quizzes; stored answers are kept. The admin account must be listed in `public.admins`; the existing `option_images` table and `photos` storage bucket are used.
Not yet built: adding or reordering questions, editing reactions, SZA embed player.
