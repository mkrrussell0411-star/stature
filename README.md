# Project

Greenfield repository for Cloud Agent development.

## Local development

When you add an application (for example with Next.js or Vite), commit a `package.json` and lockfile. The Cloud Agent environment will run `npm ci` (or `npm install`) automatically on each build.

## Cloud Agent environment

Configuration lives in [`.cursor/environment.json`](.cursor/environment.json). The install script [`.cursor/install.sh`](.cursor/install.sh) installs Node dependencies when a `package.json` is present.
