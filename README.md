# URL Shortener

A learning project to build a URL shortener from scratch — used as a vehicle to learn
**systems design, software architecture, and effective AI-assisted development**.

The goal is not a production product. It's to understand *why* each design decision is
made by confronting the real trade-offs a URL shortener forces you to face: how to
generate short codes, how to make redirects fast, how to store and scale the data, and
how to reason about reads vs. writes.

> **Status:** 🌱 Early / requirements stage. No code yet. Architecture decisions are
> intentionally left open and will be filled in as they are learned and justified.

---

## What is a URL shortener?

It turns a long URL into a short one and redirects visitors from the short link back to
the original.

```
https://example.com/some/very/long/path?with=params  ->  https://sho.rt/aB3xK9
```

Visiting `https://sho.rt/aB3xK9` redirects the browser to the original long URL.

---

## Requirements

### Functional requirements (what it must do)

1. **Shorten a URL** — accept a long URL and return a unique short link.
2. **Redirect** — visiting a short link redirects to the original long URL.
3. **Unique short codes** — every short link maps to exactly one long URL, and codes are
   not reused while active.
4. **Validation** — reject invalid or malformed URLs before shortening.
5. **Handle unknown codes** — a short code that doesn't exist returns a clear "not found"
   response, not a crash.

### Should support (near-term, once the basics work)

6. **Custom aliases** — let a user propose their own code (e.g. `sho.rt/mohita`), if
   available.
7. **Expiration** — allow a short link to expire after a date or a number of uses.
8. **Basic analytics** — count how many times each short link has been visited (and
   optionally when / from where).
9. **Duplicate handling** — decide what happens when the same long URL is shortened twice
   (return the existing code, or mint a new one — a deliberate choice).
10. **Simple API** — expose the core actions over an HTTP API (create link, resolve link).

### Nice to have (later / stretch)

11. **Rate limiting** — prevent abuse of the shorten endpoint.
12. **User accounts** — let a user own and manage their own links.
13. **A minimal web UI** — a page to paste a URL and get a short link back.
14. **Safe-URL checks** — flag or block known-malicious destinations.

### Non-functional requirements (qualities it should have)

- **Fast redirects** — the redirect path is the hot path; it should be low-latency.
- **Read-heavy** — expect far more redirects (reads) than link creations (writes); the
  design should reflect that.
- **Reliable** — a created short link should keep working; no silent data loss.
- **Scalable (as a learning goal)** — reason about what breaks as links and traffic grow,
  even if the first version runs on one machine.

---

## Explicitly out of scope (for now)

Kept out to stay focused on the core learning goals:

- Production-grade auth / billing
- Multi-region / high-availability deployment
- A polished, designed frontend

These may become learning exercises later, but they are not requirements today.

---

## Open design questions (to be decided as I learn)

These are intentionally **unanswered** — working through them is the point of the project:

- **Short-code generation:** random? hash-based? incrementing ID encoded to base62? How
  long should codes be?
- **Storage:** what database, and why? What does the data model look like?
- **Redirect performance:** where does caching help? What's the read path?
- **Collision handling:** how are code clashes detected and avoided?
- **Scaling reads vs. writes:** what changes when reads dominate?

Each will get documented here (or in an `docs/` / ADR folder) with the reasoning behind
the choice, not just the choice itself.

---

## Tech stack

_To be decided._ Chosen deliberately as part of the learning process rather than picked
up front.

---

## Learning goals

- **Systems design** — trade-offs, bottlenecks, and reasoning about scale.
- **Architecture** — structuring the code so it stays understandable as it grows.
- **AI-assisted development** — using AI tools well: as a thinking partner for design,
  a reviewer, and an accelerator — while still understanding every decision.
