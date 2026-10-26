# Stature

Adult-only, browser-based branching size fiction where **numeric character state** is the source of truth. Built with **SugarCube 2.37** and **Tweego**, with a Node-testable engine and optional AI/image backend hooks.

## Features (build spec phases)

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Body state engine (`apply`, derive, ledger, compare, curves) | Done |
| 2 | Text templates (`?h`, bands, units, anti-repetition, `<<sz>>`) | Done |
| 3 | Storylets, `setup.req`, threshold deck, pacing dial | Done |
| 4 | SVG scene panel, ledger scrubber, PNG export API | Done |
| 5 | Reader settings, template sweep, crawler config, AI validate stub | Done |

Optional **ComfyUI / LLM server** is documented in [`server/README.md`](server/README.md) (not required to play).

## Quick start (Linux / macOS / Cloud Agent)

```bash
npm install
npm test
npm run build
npm run dev    # http://127.0.0.1:4321
```

Output: [`dist/index.html`](dist/index.html)

## Termux (Android)

See [`docs/TERMUX.md`](docs/TERMUX.md). ARM64 builds Tweego from source via Go during `npm install`.

```bash
bash scripts/install-termux.sh
```

## Layout

```
src/js/engine/     State pipeline
src/js/text/       Templates and units
src/js/storylets/  Cards, thresholds, pacing
src/js/ui/         Scene panel and settings
src/js/ai/         Offline passage validator (for future LLM layer)
src/twee/          Story passages
tests/             Unit tests + crawler config
scripts/           Tweego bootstrap (portable / Termux-aware)
```

## Cloud Agent

[`.cursor/environment.json`](.cursor/environment.json) runs `npm ci` and serves the built story on port **4321**.

## Compliance

- Cast loader requires `age >= 18`
- Age gate passage on first load
- Module/intensity filtering via reader settings
