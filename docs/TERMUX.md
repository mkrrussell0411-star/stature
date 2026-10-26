# Stature on Termux (Android)

Stature runs fully on Termux with Node.js. Tweego has no official ARM64 Linux binary, so the bootstrap script **compiles Tweego from source** with Go on `aarch64`.

## One-shot setup

```bash
pkg update -y
pkg install -y nodejs-lts git curl unzip golang which
git clone <your-repo-url> stature && cd stature
bash scripts/install-termux.sh
```

Or manually:

```bash
npm install   # runs scripts/bootstrap-tools.sh
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:4321` in Chrome/Firefox on the device (or port-forward from a laptop).

## Tips

- Keep the project under Termux home (e.g. `~/stature`), not shared storage, for executable permissions.
- If `go build` fails, run `pkg upgrade golang` and retry `npm install`.
- You can also `pkg install` a community `tweego` package if available; bootstrap will symlink it when `command -v tweego` succeeds.
- SugarCube output is a single `dist/index.html`; copy it anywhere to play offline.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TMPDIR` | Temp dir for downloads (defaults to `/tmp`) |
| `TERMUX_VERSION` | Set by Termux; auto-detected for ARM build path |
