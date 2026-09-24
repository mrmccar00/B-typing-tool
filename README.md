# CP Renter Segment Typing Tool

A light, fun 10-question survey that classifies respondents into one of
Continental Properties' seven renter segments using the linear discriminant
model from `CP_Classify_Tool_10_Questions.xlsx`. Because classification is
probabilistic, results show the top match plus a full probability breakdown
across all seven segments, each with a positive-sounding description drawn
from the segment profile deck. Respondents can also say whether they agree
with their assigned segment or pick the one they identify with instead.
Every response is saved to a database and can be exported as a CSV from a
hidden, password-protected page.

## How it works

- `src/lib/questions.ts` — the 10 survey questions and their response scales.
- `src/lib/segments.ts` — the 7 segments, their discriminant coefficients
  (reproduced exactly from the "10 question DISCRIM" sheet), and a positive
  one-line `blurb` per segment (sourced from `Class_B_Segment_Profiles.pdf`).
  Blurb/emoji text is safe to edit freely — it has no effect on scoring.
- `src/lib/scoring.ts` — computes each segment's score, converts to
  probabilities via softmax, and picks the top match. Verified against the
  workbook's own example (age 32, running 3x/week, etc. → "Stretchers" at
  53.9%) and reproduces it exactly.
- `src/app/page.tsx` — the survey UI (one question at a time, progress bar,
  animated results reveal, agree/disagree + self-selection prompt).
- `src/app/api/responses/route.ts` — validates answers, scores them, and
  saves the response to Postgres. Returns the new response's `id`.
- `src/app/api/responses/[id]/route.ts` — `PATCH` endpoint the reveal screen
  calls to record the respondent's self-selected segment.
- `src/app/[secretPath]` + `src/app/api/export` — a hidden, password-gated
  page to download all responses as CSV. See "Exporting results" below.

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a Postgres connection string (see hosting options below).
   - `ADMIN_PASSWORD` — the password required to log in to the results page.
   - `ADMIN_PATH_SLUG` — a long, random, secret URL segment for the results
     page (e.g. a UUID). Without both this and `ADMIN_PASSWORD` set, the
     results page and CSV export are disabled entirely (404 / 401).
3. Create the database tables:
   ```
   npm run db:push
   ```
4. Run the dev server:
   ```
   npm run dev
   ```
   Visit `http://localhost:3000` for the survey. The results page lives at
   `http://localhost:3000/<ADMIN_PATH_SLUG>` — it is not linked from
   anywhere in the app, and any other path 404s normally.

## Deploying

This app is a standard Next.js app and needs a Postgres database. Two common options:

**Vercel + a hosted Postgres provider (recommended)**
1. Push this repo to GitHub and import it into Vercel.
2. Add a Postgres database (Vercel's Neon/Postgres integration, or bring your
   own from Neon, Supabase, or Azure Database for PostgreSQL).
3. Set `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_PATH_SLUG` in the Vercel
   project's environment variables.
4. Vercel runs `npm run build`, which runs `prisma generate` automatically.
   After the first deploy, run `npx prisma db push` once (locally, pointed at
   the production `DATABASE_URL`) to create the tables.

**Azure App Service**
1. Provision an Azure Database for PostgreSQL flexible server.
2. Set `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_PATH_SLUG` as App Service
   application settings.
3. Deploy the app (e.g. via GitHub Actions or `az webapp up`), then run
   `npx prisma db push` once against the production database.

## Exporting results

The results page is intentionally not linked from the survey or any nav —
it only exists at `https://your-app.com/<ADMIN_PATH_SLUG>`. Visiting any
other path (including guesses like `/admin`) returns an ordinary 404, and
the page itself still requires `ADMIN_PASSWORD` to log in before the
"Download CSV" button appears. Treat the URL like a credential: share it
only with people who need to pull results, and rotate `ADMIN_PATH_SLUG` if
you think it's leaked.

The CSV includes, per response: every raw answer, the assigned segment, the
respondent's self-selected segment (if they answered the agree/disagree
prompt), and the probability for all seven segments. No names or emails are
collected.

## The reveal screen's self-identification prompt

After showing the top match, the reveal screen asks "Does this feel like
you?" If the respondent agrees, that's recorded as their self-selected
segment. If not, they can pick whichever of the other six segments they
feel fits better; that choice is saved via `PATCH /api/responses/[id]`
as `selfSelectedSegmentId`/`selfSelectedSegmentName`, separate from the
model's own `assignedSegmentId`. This field is `null` until the respondent
answers the prompt.

## Editing the survey

- To reword a question or its answer labels, edit `src/lib/questions.ts`.
  Don't change the numeric `value` codes — they must keep matching the
  coefficients in `segments.ts`.
- To rename a segment or rewrite its blurb/emoji, edit `src/lib/segments.ts`.
  Don't touch `constant` or `coefficients` unless you're re-deriving the
  model from new study data.
