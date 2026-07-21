# Releasing

This package is released manually from GitHub Actions.

## Release Checklist

1. Confirm the package version in `package.json` is the version you want to ship.
2. Review the README, [docs](https://docs.reactcandlesticks.com/docs/), and changelog notes for anything user-visible in the release.
3. Install the project git hooks with `npm run hooks:install`.
4. Run `npm run check`.
5. Run `npm run build`.
6. Run `npm run badges:package` if the version or bundle output changed.
7. Run `npm run pack:check` and confirm the tarball contents look correct.
8. Run `npm run smoke:consumer` to verify a packed install builds in a fresh Vite consumer app.
9. Commit and push the release-ready changes to `main`.

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

npm automatically generates provenance for trusted publishes from a public GitHub repository. The workflow does not need `NODE_AUTH_TOKEN`, `NPM_TOKEN`, or an explicit `--provenance` flag.

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
