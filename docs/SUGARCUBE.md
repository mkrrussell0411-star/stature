# SugarCube patterns for Stature (Tweego 3 + SugarCube 2.37)

## Passage types

| Twee tag | Use |
| --- | --- |
| `[script]` | **Raw JavaScript only** in `StoryInit` — no `<<script>>` wrappers |
| `[stylesheet]` | CSS only |
| (none) | Passage body uses **SugarCube macros** and HTML |

## Templates (`?name`)

Register with `Template.add()` in the engine bundle. In passage **prose**, use template syntax directly:

```twee
Your height is ?h and you look ?size-word.
```

Do **not** write `<<print ?h>>` — the parser treats `?` as invalid JavaScript inside `<<print>>`.

## Live regions (`<<do>>` / `<<redo>>`)

SugarCube 2.37+:

```twee
<<do tag "size">>
  <<print setup.engine.text.renderFocusLine()>>
<</do>>

<<button "Grow">>
  <<run setup.engine.apply($focus, { height_cm: 5 }, "beat")>>
  <<redo "size">>
<</button>>
```

## DOM and `<<run>>`

Macros at the top of a passage can run **before** HTML exists. Stature uses:

- `$(document).on(':passagedisplay.stature', …)` to mount the SVG scene panel
- `<<refreshScene>>` macro after stat changes

Scene host element: `<div id="stature-scene-panel">`.

## Comparisons in macros

Avoid `>=` / `<=` inside `<<= …>>` attributes (breaks the macro parser). Compute in JavaScript:

```twee
<<set _svg to setup.engine.sceneSvgForScrub($onStage, $scrubIndex)>>
<<= _svg>>
```

## Settings

`Setting.addList` requires `list: ["Label A", "Label B"]` and `default` must be **exactly** one of those strings. Internal keys (`gentle`, `metric`, …) are mapped in `onChange` in `src/js/ui/settings.js`.

## Links

Prefer wiki links for simple navigation:

```twee
[[Settings|Settings]]
```

## Build

```bash
npm run build   # dist/index.html
```

Tweego must find story formats (`TWEEGO_PATH` or `vendor/tweego/storyformats/`).
