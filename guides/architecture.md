# Architecture and public boundary

## Production at a high level

The full clickngoal product uses a React/TypeScript web interface, a Fastify API and PostgreSQL. PWA and Android share the web UI. Kotlin is a thin Android shell for platform integrations rather than a second implementation of business logic.

Authentication, authorization, privacy checks and shared data belong on the server. The private service implementation and deployment topology are outside this public repository. Client-side checks are never enough to protect accounts or private goals.

## Public source

The foundation exports pure progress-date calculations, keyboard calendar navigation, local-midnight and live-system-theme hooks. These are extracted from the official application's 1.0.50 code, rather than illustrative pseudocode. Existing tests were retained where available.

The new local `community.ts` shows immutable goal/report/comment operations. It validates date keys, avoids counting a date twice, retains reactions/comments on note edits, distinguishes completion from notes, and demonstrates visibility filtering. Its fixed local viewer is a demonstration convenience and must never be used as real authentication.

`App.tsx` renders a standalone example; `main.tsx` starts it. Vite builds relative asset URLs so the web archive works under a subdirectory. No production endpoints, keys, databases, admin credentials, signing material or private operation scripts are included. Compiled source maps are disabled; the source ZIP contains the explicitly published code only.

## Data boundaries

- A date is a calendar key (`YYYY-MM-DD`), not the timestamp of clicking a cell.
- A completion mark and a note are separate. Selecting a date changes neither.
- A local note is updated per goal/author/date; saving twice does not create duplicate daily reports.
- The current streak can continue through yesterday; completed days and the best streak are distinct totals.
- Themes follow OS changes while in system mode; explicit light/dark remain explicit.
- The demo validates stored shapes and shows storage failures rather than claiming to save.

Local state is under `clickngoal.community.v1` in browser storage. It is not synced or backed up. Refresh preserves goals/reports when storage is available; clearing storage removes them. Demo preferences currently last for the running session. The production product has separate account and device settings.

## Developing further

Replace the local persistence adapter with a tested API only after implementing server-side session authentication, authorization, input validation, transaction boundaries, abuse handling, account deletion and private-data tests. Do not point a derivative demo at the private production API. A full self-hosted backend is a future publication decision, not included or promised in this release.
