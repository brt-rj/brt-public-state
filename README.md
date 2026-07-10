# brt-public-state

Headless CMS | Shared assets

Publication repo for BRT Data Platform orchestration state. Everything here is
sanitized, view-only data written by workflows in `brt-rj/brt-ork` and
`brt-rj/brt-infra` — no secrets, tokens, operator controls, or internal
diagnostics (ADR-0003).

## Layout

| Path | Written by | Contents |
| :--- | :--- | :--- |
| `releases/{release_id}/manifest.json` | `brt-ork freeze` | Immutable release manifest: exact repo SHAs, tags, and evidence for a release point. Never rewritten. |
| `environments/{env}/current.json` | `brt-ork freeze` | Pointer to the release currently considered current for `prod`/`test`/`dev`. |
| `snapshots/{env}/latest-run.json` | `brt-ork` orchestrate (`publish-run` job) and `freeze` | Latest Public Run Snapshot: run status, release ID, environment, timestamps, and per-repo commit hashes. Validated against `brt-ork/schemas/run-snapshot.schema.json`. |
| `deployments/log.json` | `brt-ork` orchestrate (`publish-run` job) | Rolling deployment log, newest first, capped at 50 runs. |
| `deployments/latest.json` | `brt-infra` `Server-deploy.yml` | Legacy branch-name map kept for existing consumers; superseded by the run snapshot above. |

## Consumers

- `https://barati.dev/data-platform/` (`barati-dev.github.io`) renders the
  view-only latest run snapshot on the overview page above the architecture
  diagram.
- `ork.barati.dev` (Cloudflare Access protected Orchestrator Admin UI, served
  by `brt-infra`) proxies `snapshots/`, `releases/`, `environments/`, and
  `deployments/` from this repo's `main` branch.
