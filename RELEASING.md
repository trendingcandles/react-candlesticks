# Releasing

This package is released manually from GitHub Actions.

## One-Time Setup

1. Create an npm automation token with publish access for `react-candlesticks`.
2. Add that token to the GitHub repository as the `NPM_TOKEN` secret.
3. Create a protected GitHub Actions environment named `npm` if you want manual approval before publish.

## Release Checklist

1. Confirm the package version in `package.json` is the version you want to ship.
2. Review the README, [docs](https://docs.reactcandlesticks.com/docs/), and changelog notes for anything user-visible in the release.
3. Run `npm run check`.
4. Run `npm run build`.
5. Run `npm run pack:check` and confirm the tarball contents look correct.
6. Run `npm run smoke:consumer` to verify a packed install builds in a fresh Vite consumer app.
7. Commit and push the release-ready changes to `main`.

## Publishing From GitHub Actions

1. Open the `Release` workflow in GitHub Actions.
2. Choose the npm dist-tag:
   - `latest` for a normal public release
   - `next` for a prerelease or beta channel
3. Start with `dry_run = true` if you want to validate the pipeline first.
4. Re-run with `dry_run = false` to publish.

The workflow will:

1. Install dependencies with `npm ci`
2. Run `npm run check`
3. Run `npm run pack:check`
4. Run `npm run smoke:consumer`
5. Publish with provenance when `dry_run` is disabled

## Local Safety Gates

- `prepublishOnly` runs `check` and `pack:check`
- `build` removes `dist/*.tsbuildinfo` so the published tarball stays clean
- `pack:check` rebuilds before creating the dry-run tarball so it validates real publish output

## Rollback

If a bad version is published:

1. Deprecate the bad version on npm instead of unpublishing in most cases.
2. Fix the issue in git.
3. Bump the version.
4. Publish a corrected release.
