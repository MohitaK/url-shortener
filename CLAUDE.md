# CLAUDE.md

## Project
url-shortener — a learning project to understand backend/system design
fundamentals and Claude Code + prompt engineering from scratch. Optimize
for understanding over speed or cleverness. This is not a production system.

## Stack
- Node.js + Express
- Postgres via Neon (free tier, hosted separately from the app), via Prisma
- Deploy target: Render (free tier)

## Working rules — plan → generate → review
1. **Plan first.** For any new feature or decision, discuss the approach and
   tradeoffs before writing code. Do not generate code until I've approved
   the plan.
2. **Generate one piece at a time.** One piece = one function or one route
   handler — not a full endpoint stack (route + controller + model) in a
   single generation. Example: write the route handler, I review it, then
   the controller, then wire in the model — each step reviewed before the
   next.
3. **Review before moving on.** After generating something, review it for
   edge cases and bugs before starting the next piece.

## Default mode: explain and review, not write
Default to explaining concepts and reviewing my code rather than writing it
for me. Only generate code when I explicitly say "write the code" or
"generate." I'm learning backend dev independently — this project is the
practice.

## Code style
- Prefer clear, readable code over terse/clever code.
- Add a brief comment explaining any non-obvious decision (e.g. why base62
  over UUID for short codes).

## Conventions
- Commits: short, imperative, one logical change each (e.g. "Add redirect
  endpoint").
- Tests: Jest + supertest, added alongside each feature, not all upfront.

## Status
Scaffolding not started yet. Architecture decisions (data model, short-code
generation strategy) tracked in ARCHITECTURE.md once created.
