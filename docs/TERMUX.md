# Stature on Termux (Android)

Stature runs on Termux with Node.js. Tweego has no official ARM64 Linux binary, so on `aarch64` the bootstrap script **downloads the Tweego source as a `.tar.gz` with curl** (no `git clone`) and compiles it with Go.

## One-shot setup

```bash
pkg update -y
pkg upgrade -y
pkg install -y nodejs-lts curl unzip tar golang which
git clone https://github.com/mkrrussell0411-star/stature.git && cd stature
bash scripts/install-termux.sh
```

Or manually:

```bash
npm install   # runs scripts/bootstrap-tools.sh
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:4321` in Chrome/Firefox on the device.

## If `git` / `curl` breaks (ngtcp2 symbol error)

Some Termux installs hit:

```text
git-remote-https … cannot locate symbol "ngtcp2_crypto_get_path_challenge_data2_cb"
```

That is a **broken git ↔ curl/libngtcp2 pairing**. Stature’s bootstrap **does not use git** for Tweego anymore—only **curl + tar + go build**.

Still fix the system for your own `git clone` / `git pull`:

```bash
pkg update -y
pkg upgrade -y
pkg install -y curl libngtcp2 git
# if it persists:
pkg reinstall curl libngtcp2 git
```

Then clone again, or download the repo zip from GitHub in the browser and unzip into `~/stature`.

## Tweego without compiling

1. **Termux package** (if available): `pkg install -y tweego` — bootstrap symlinks it automatically.
2. **Prebuilt binary URL**: set before `npm install`:

   ```bash
   export STATURE_TWEEGO_BIN_URL='file:///path/to/tweego'
   npm install
   ```

## Tips

- Keep the project under Termux home (e.g. `~/stature`), not shared storage, for executable permissions.
- If `go build` fails, run `pkg upgrade golang` and retry `npm install`.
- Play offline: copy `dist/index.html` anywhere after `npm run build`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TMPDIR` | Temp dir for downloads (defaults to `/tmp`) |
| `STATURE_TWEEGO_BIN_URL` | Direct download URL (or `file://`) for a `tweego` executable |
| `STATURE_TWEEGO_SOURCE_URL` | Override Tweego source tarball URL (default: GitHub tag archive) |
