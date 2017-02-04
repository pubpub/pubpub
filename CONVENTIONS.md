# Conventions

## Servers

- `pubpub.org` Deployed from master branch on pubpub/pubpub
- `api.pubpub.org` Deployed from master branch on pubpub/pubpub-api
- `dev.pubpub.org` Deployed from dev branch on pubpub/pubpub
- `dev-api.pubpub.org` Deployed from dev branch on pubpub/pubpub-api
- `staging.pubpub.org` Deployed from staging branch on pubpub/pubpub
    (staging.pubpub.org uses the production API, so there should never be a staging-api.pubpub.org)

- `docs.pubpub.org` Deployed from master branch on pubpub/pubpub-api
- `dev-docs.pubpub.org` Deployed from dev branch on pubpub/pubpub-api

Arbitrary subdomains are acceptable for custom branches if needed, e.g: `teams.pubpub.org`.

Old Versions are maintained for reference.

There are no specfic versions of dev (e.g. v2-dev or v2-dev-api), as the dev branch is a 'top-level' feature, it always has the most recent changes. That is, we only maintain a version history of the production branches.

- `v2-api.pubpub.org`
- `v1-api.pubpub.org`
- `v2.pubpub.org`
- `v1.pubpub.org`