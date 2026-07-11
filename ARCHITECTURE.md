# ARCHITECTURE.md

## Short-code generation
1. Insert a new row into `urls` with `long_url` set. The DB assigns a
   sequential `id` (auto-increment/serial primary key).
2. Compute `short_code = base62_encode(id XOR SECRET)`, where SECRET is a
   fixed constant stored in an env var. XOR is reversible, so this is a
   bijection — every unique id maps to exactly one short_code, no collision
   checks needed.
3. Update the row to store the computed `short_code`.

Note: this requires two DB round trips (insert, then update) since the id
isn't known until after insert. A more advanced version would pre-fetch the
next id from the DB sequence before inserting, allowing a single insert —
worth trying later once the two-step version works.

Security note: XOR with a fixed secret is obfuscation, not cryptographic
security. If an attacker learns even one genuine (id, short_code) pair,
they can compute `id XOR short_code = SECRET` and decode every other code.
Acceptable here since the goal is preventing casual enumeration, not
resisting a determined attacker — a security-sensitive system would use a
keyed hash (HMAC) instead.

## Data model — `urls` table
| column      | type      | notes                              |
|-------------|-----------|-------------------------------------|
| id          | serial    | primary key, auto-increment         |
| short_code  | varchar   | unique, indexed                     |
| long_url    | text      | not null                            |
| created_at  | timestamp | default now()                       |
| click_count | integer   | default 0                           |

short_code is stored explicitly (not derived on the fly at read time) so
redirects are a direct indexed lookup, and to leave room for custom
aliases later without restructuring.

## Request flow — POST /shorten
1. Validate `long_url` is present and well-formed.
2. Insert row → get `id` → compute `short_code` → update row (see above).
3. Return the full short URL to the client.

## Request flow — GET /:code
1. Look up `urls` WHERE `short_code` = the path param.
2. Not found → 404.
3. Found → increment `click_count`, then redirect to `long_url` using a
   **302 (temporary) redirect, not 301**. This matters: a 301 tells
   browsers and CDNs "this redirect never changes," so they cache it and
   future clicks may never hit your server again — breaking click
   tracking. 302 forces every click through your server, which is why
   real URL shorteners use it despite 301 being the "more correct" HTTP
   status for a permanent mapping.

Note: incrementing click_count synchronously on every redirect is fine at
this scale. At high traffic this write becomes a bottleneck and would
normally be moved off the hot path (e.g. queued and batched) — worth
knowing, not worth building yet.

## Decisions & Rationale

### Short-code generation
| Option                                      | Unique by construction  | Predictable? | Extra DB round trip |
|-----------------------------------------------|:---:|:---:|:---:|
| Counter + base62 (no obfuscation)             | Yes | Yes | No |
| Counter + XOR obfuscation + base62 (chosen)   | Yes | No  | No |
| Random + collision check                      | No (probabilistic) | No | Yes, per attempt |
| Hash of URL, truncated                        | No (collision possible) | No | Yes, on collision |

Chosen: counter + XOR + base62 — uniqueness guaranteed with no lookup
cost, and enumeration is blocked without needing collision handling. XOR
here is obfuscation, not cryptographic security (see security note in the
Short-code generation section above).

### short_code storage
| Approach                          | Redirect lookup            | Supports custom aliases | Extra column |
|-------------------------------------|-----------------------------|:---:|:---:|
| Derive from id at read time         | Decode, then lookup by id  | No  | No  |
| Store as explicit column (chosen)   | Direct indexed lookup      | Yes | Yes |

Chosen: explicit column — matches real-world practice, simpler hot path,
leaves room for custom aliases later.

### Redirect status code
Chosen: 302, not 301. A 301 gets cached by browsers/CDNs, so repeat
clicks may never reach the server, breaking click_count. 302 forces every
click through the server.

## Status
Decisions finalized. Scaffolding not yet started.
