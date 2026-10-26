# Stature

Adult-only, browser-based branching fiction where **numeric character state** drives every measurement, comparison, and size word. Built with **SugarCube 2.37** and **Tweego**.

## Phase 1 (current)

- Body state engine in `src/js/engine/` (Node-testable)
- Scale module with stages and reference objects
- Minimal Twee demo with age gate and growth buttons
- Compiled output in `dist/index.html`

## Commands

```bash
npm install
npm test
npm run build
npm run dev    # serves dist/ on port 4321
```

## Layout

```
src/
  twee/           Passages and story bootstrap
  js/engine/      Sheet, apply, derive, ledger, compare
  js/modules/     Fetish/stat modules (scale first)
tests/engine/     Unit tests
dist/             Compiled HTML (generated)
```

## Cloud Agent

`.cursor/install.sh` runs `npm ci` and downloads Tweego/SugarCube into `vendor/`. Use `npm run dev` for a static preview of the compiled story.
