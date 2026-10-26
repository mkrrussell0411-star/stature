# Stature on Termux (Android)

## Broken `curl` / `git` (ngtcp2 symbol error)

If **even `curl` fails** with `ngtcp2_crypto_get_path_challenge_data2_cb`, Termux’s curl package is broken. **Node’s HTTPS still works** on most installs.

### Fix Termux (try first)

```bash
pkg update -y && pkg upgrade -y
pkg reinstall curl libngtcp2
# or full refresh:
pkg upgrade -y
```

### Install / update Stature with Node only (no curl, no git)

Requires **Node** (`pkg install -y nodejs-lts tar unzip golang which`).

**If you already have `~/stature` with `scripts/termux-node-sync.mjs`:**

```bash
cd ~/stature
node scripts/termux-node-sync.mjs
npm install
npm run build
```

**If you have nothing yet** — paste this whole block in Termux (downloads repo via Node, then builds):

```bash
mkdir -p ~/stature && cd ~/stature
node <<'NODE'
const https=require("https"),fs=require("fs"),{execSync}=require("child_process"),os=require("os"),path=require("path");
const home=os.homedir(),root=path.join(home,"stature"),tmp=os.tmpdir(),arc=path.join(tmp,"st-main.tar.gz"),ex=path.join(tmp,"st-ex");
const url="https://github.com/mkrrussell0411-star/stature/archive/refs/heads/main.tar.gz";
function get(u,cb){https.get(u,r=>{if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return get(new URL(r.headers.location,u).href,cb);const w=fs.createWriteStream(arc);r.pipe(w);w.on("finish",cb);}).on("error",e=>{console.error(e);process.exit(1);});}
get(url,()=>{try{execSync(`rm -rf "${ex}" && mkdir -p "${ex}" && tar -xzf "${arc}" -C "${ex}"`);const src=path.join(ex,"stature-main");for(const n of fs.readdirSync(src)){if(["node_modules","vendor"].includes(n))continue;execSync(`rm -rf "${root}/${n}" 2>/dev/null; cp -a "${src}/${n}" "${root}/"`);}console.log("Synced to",root);}catch(e){console.error(e);process.exit(1);}});
NODE
npm install
npm run build
```

After that, future updates:

```bash
cd ~/stature && node scripts/termux-node-sync.mjs && npm install && npm run build
```

`npm install` uses **Node HTTPS** for Tweego/SugarCube downloads when curl is broken (see `scripts/https-download.mjs`).

## Normal setup (working curl)

```bash
pkg install -y nodejs-lts curl unzip tar golang which
bash scripts/termux-install.sh
```

## Play

- Offline: `~/stature/dist/index.html` in a browser after `npm run build`
- Local server: `npm run dev` → http://127.0.0.1:4321

## Environment variables

| Variable | Purpose |
| --- | --- |
| `STATURE_ROOT` | Install dir (default `~/stature`) |
| `STATURE_TWEEGO_BIN_URL` | Prebuilt tweego binary URL or `file://` path |
| `STATURE_TWEEGO_SOURCE_URL` | Override Tweego source tarball URL |
