[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mouns4117-ai/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mouns4117-ai/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy is shown with its official name, description and grade as PlayStation publishes them, and a guide in our own words that cites its sources — what to do, where and how, and when it can be missed.

What it does:

- **Checklist tracker** — tick trophies off as you earn them; progress is saved in the browser (localStorage) and can be exported to a file and imported back.
- **Filters by kind** — story, missable, collectibles, activities, online (the official list holds no online trophies, and the app says so), and other — plus a grade filter and search.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum** — five stages built from the official descriptions: story first, side stories and missables, activities, collectibles and the map, then cleanup and 100%.
- **Missables flagged** — six trophies flagged from what their official descriptions imply (a story choice, or a one-off moment), each with the reason it is flagged.
- **Cited guides** — every trophy's guide names its sources beside it: the official list as Exophase and PSNProfiles list it, for the name, description and grade. Where a step has not yet been checked in the game, the guide says so plainly instead of inventing a location.

The look is our own, with no Rockstar Games logo, official artwork or game imagery. The app is static files under `app/` with no build step and makes no network request at run time — it works with the network off.

## Run

Serve `app/` with any static server and open `app/index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or, without Node:

```sh
python3 -m http.server --directory app 8000
```

## Layout

- `app/index.html` — the shell: header with progress, toolbar, checklist, guide pane, roadmap and missables views.
- `app/css/base.css` — the theme (a Vice-sunset look of our own).
- `app/js/config.js` — storage key, kinds, grades, roadmap stages.
- `app/js/data.js` — loads `app/data/trophies.json`.
- `app/js/store.js` — saved progress: localStorage, export and import.
- `app/js/filters.js` — kind, grade and search filtering, plus the spoiler rule.
- `app/js/render-list.js` — the checklist rows.
- `app/js/render-detail.js` — the guide pane for one trophy, with its sources.
- `app/js/render-roadmap.js` — the Roadmap to Platinum and Missables views.
- `app/js/main.js` — boot, toolbar wiring and hash routing.
- `app/data/trophies.json` — the 55 trophies: official name, description and grade, kind, roadmap stage, missable flag, and a guide in our own words with its sources.
- `main.ts` — the make.fun entry program: copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `dossier.json`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This entry was built for make.fun's `gta6-trophy-guide-01` bounty.
