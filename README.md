# URL Shortener

A simple URL shortener built to learn backend development, systems design, and software architecture. 
Takes a long URL, gives you a short one, redirects when you visit it.

Live at: https://url-shortener-17gz.onrender.com (free tier, so the first request after
it's been idle can take 30-50s to wake up)

## Stack

Node/Express, Postgres (hosted on Neon) via Prisma, deployed on Render.

## Endpoints

**POST /shorten**
```bash
curl -X POST https://url-shortener-17gz.onrender.com/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://en.wikipedia.org/wiki/URL_shortening"}'
```
Returns `{ "shortUrl": "..." }`. 400 if the URL is missing or invalid.

**GET /:code** — redirects to the original URL, 404 if it doesn't exist.

**GET /stats/:code** — returns `{ "clickCount": <number> }` for a code.

**GET /health** — returns `{ "status": "ok" }`.

## Running it locally

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, SHORT_CODE_SECRET, BASE_URL
npx prisma migrate dev
npm start
```
Runs on `http://localhost:3000` by default.

## How short codes work

Each row gets a normal auto-increment id from Postgres. I XOR that id with a secret and
base62-encode it to get the short code — keeps codes unique without a database
collision check, and stops them from being obviously sequential (`/1`, `/2`, `/3`...).
The reasoning and other approaches I considered are in `ARCHITECTURE.md`.

## Notes

No automated tests yet (jest/supertest are installed, just haven't written them).
Custom aliases, expiration, and rate limiting are ideas for later, not started.
