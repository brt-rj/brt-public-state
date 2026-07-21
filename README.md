# brt-public-state

Headless CMS | Shared assets

Publication repo for BRT Data Platform orchestration state. Everything here is
sanitized, view-only data written by workflows in `brt-rj/brt-ork` and
`brt-rj/brt-infra` -- no secrets, tokens, operator controls, or internal
diagnostics (ADR-0003).

## Layout

| Path | Written by | Contents |
| :--- | :--- | :--- |
| `releases/{release_id}/manifest.json` | `brt-ork freeze` | Immutable release manifest: exact repo SHAs, tags, and evidence for a release point. Never rewritten. |
| `environments/{env}/current.json` | `brt-ork freeze` | Pointer to the release currently considered current for `prod`/`test`/`dev`. |
| `snapshots/{env}/latest-run.json` | `brt-ork` orchestrate (`publish-run` job) and `freeze` | Latest Public Run Snapshot: run status, release ID, environment, timestamps, and per-repo commit hashes. Validated against `brt-ork/schemas/run-snapshot.schema.json`. |
| `deployments/log.json` | `brt-ork` orchestrate (`publish-run` job) | Rolling deployment log, newest first, capped at 50 runs. |
| `deployments/latest.json` | `brt-infra` `Server-deploy.yml` | Legacy branch-name map kept for existing consumers; superseded by the run snapshot above. |
| `now/goodreads.json` | `brt-ork` `capture-now-page-data.yml` | Currently-reading book pulled from Goodreads' public per-shelf RSS feed. |
| `now/spotify.json` | `brt-ork` `capture-now-page-data.yml` | Now-playing and recently-played tracks from the Spotify Web API. |
| `now/methodos.json` | `brt-ork` `capture-now-page-data.yml` | Latest training session summary and ACWR from `brt-train`'s MCP server. |
| `analytics/portfolio-engagement/latest.json` | `brt-airflow` `portfolio_engagement_daily` | Aggregate-only Amplitude engagement metrics for the rolling 30 completed UTC days, including freshness and collection coverage. Failed refreshes retain the last successful metrics as `stale`; no internal error details are published. |
| `analytics/{acquisition,monetization,retention,sales}/latest.json` | *(pull workflows not yet built -- placeholders, `ok: false`)* | Per-pillar analytics placeholders for the remaining Growth reports. |

Each `now/*.json` and `analytics/*/latest.json` file carries its own `ok`
boolean. Portfolio Engagement additionally separates validity from freshness:
`fresh` and `stale` payloads remain `ok: true`, while `unavailable` means no
successful aggregate exists. Its public `error` is always `null`; operational
details remain in Airflow logs.

## Consumers

- `https://barati.dev/data-platform/` (`barati-dev.github.io`) renders the
  view-only latest run snapshot on the overview page above the architecture
  diagram.
- `https://barati.dev/now/` (`barati-dev.github.io`) statically renders a
  skeleton at build time, then hydrates each card client-side from
  `now/goodreads.json`, `now/spotify.json`, and `now/methodos.json` on this
  repo's `main` branch.
- `https://analytics.barati.dev/` (`brt-analytics`) fetches each pillar's
  `analytics/{pillar}/latest.json` client-side to hydrate its dashboard,
  rendering a gap/status state until real data lands.
- `ork.barati.dev` (Cloudflare Access protected Orchestrator Admin UI, served
  by `brt-infra`) proxies `snapshots/`, `releases/`, `environments/`, and
  `deployments/` from this repo's `main` branch.
