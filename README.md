# CP Renter Segment Typing Tool

A light, fun 10-question survey that classifies respondents into one of
Continental Properties' seven renter segments using the linear discriminant
model from `CP_Classify_Tool_10_Questions.xlsx`. Because classification is
probabilistic, results show the top match plus a full probability breakdown
across all seven segments. Every response is saved to a database and can be
exported as a CSV.

## How it works

- `src/lib/questions.ts` — the 10 survey questions and their response scales.
- `src/lib/segments.ts` — the 7 segments and their discriminant coefficients
  (reproduced exactly from the "10 question DISCRIM" sheet). Segment `blurb`
  text is placeholder copy — edit freely, it has no effect on scoring.
- `src/lib/scoring.ts` — computes each segment's score, converts to
  probabilities via softmax, and picks the top match. Verified against the
  workbook's own example (age 32, running 3x/week, etc. → "Stretchers" at
  53.9%) and reproduces it exactly.
- `src/app/page.tsx` — the survey UI (one question at a time, progress bar,
  animated results reveal).
- `src/app/api/responses/route.ts` — validates answers, scores them, and
  saves the response to Postgres.
- `src/app/admin` + `src/app/api/export` — a password-gated page to download
  all responses as CSV.

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a Postgres connection string (see hosting options below).
   - `ADMIN_PASSWORD` — the password required to view/export results at `/admin`.
3. Create the database tables:
   ```
   npm run db:push
   ```
4. Run the dev server:
   ```
   npm run dev
   ```
   Visit `http://localhost:3000` for the survey and `http://localhost:3000/admin`
   for the results export page.

## Deploying

This app is a standard Next.js app and needs a Postgres database. Two common options:

**Vercel + a hosted Postgres provider (recommended)**
1. Push this repo to GitHub and import it into Vercel.
2. Add a Postgres database (Vercel's Neon/Postgres integration, or bring your
   own from Neon, Supabase, or Azure Database for PostgreSQL).
3. Set `DATABASE_URL` and `ADMIN_PASSWORD` in the Vercel project's environment
   variables.
4. Vercel runs `npm run build`, which runs `prisma generate` automatically.
   After the first deploy, run `npx prisma db push` once (locally, pointed at
   the production `DATABASE_URL`) to create the tables.

**Azure App Service**
1. Provision an Azure Database for PostgreSQL flexible server.
2. Set `DATABASE_URL` and `ADMIN_PASSWORD` as App Service application settings.
3. Deploy the app (e.g. via GitHub Actions or `az webapp up`), then run
   `npx prisma db push` once against the production database.

## Exporting results

Go to `/admin`, log in with `ADMIN_PASSWORD`, and click "Download CSV". The
CSV includes every raw answer, the assigned segment, and the probability for
all seven segments per response — nothing else is collected (no names or
emails).

## Editing the survey

- To reword a question or its answer labels, edit `src/lib/questions.ts`.
  Don't change the numeric `value` codes — they must keep matching the
  coefficients in `segments.ts`.
- To rename a segment or rewrite its blurb/emoji, edit `src/lib/segments.ts`.
  Don't touch `constant` or `coefficients` unless you're re-deriving the
  model from new study data.
