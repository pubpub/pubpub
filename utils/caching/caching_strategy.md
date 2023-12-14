Last validated: 2023-12-14

# Caching Strategy

This document briefly describes the caching strategy employed on PubPub.

## Overview

PubPub caches pages on Fastly that follow the following rules:

-   Do not match `req.url ~ "(/login|/logout|/api|/auth|\?access=)"`
-   Do not match `req.http.Cookie ~ "pp-no-cache"`. The `pp-no-cache` cookie is set when you log in.

This means that public facing pages for non-logged in users are cached, as those make up the majority of traffic.

Pages are cached for a certain period of time (1 month) or until purged.

## Purging

Pages are tagged in Fastly with so called [`Surrogate-Keys`](https://docs.fastly.com/en/guides/purging-with-surrogate-keys).
Currently, we tag entire communities with their hostname, e.g. `jtrialerror.duqduq.org` for DuqDuq and `journal.trialanderror.org` for prod for the `jtrialerror` community. This is configured on Fastly.

When _anything_ on the community changes, we send a request to fastly to purge the cache matching that tag, meaning all the pages will now miss and be served directly from the PubPub servers again.

While not very precise, this makes sure we do invalidate the cache when necessary and do not continue to serve outdated pages. While it is true that when users make changes, they usually make quite a few (create pub, update pub, add attributions, change facets, add members, etc.), leading to the cache being invalidated quite often, they usually do not make changes that frequently: they maybe add one pub and then leave it alone for a while. This means that the cache is still very effective, as most content goes untouched.

### Where

Purging happens in two places:

-   The purge middleware defined here: https://github.com/pubpub/pubpub/blob/main/utils/caching/purgeMiddleware.ts#L1-L100
-   After workerTask completion here: https://github.com/pubpub/pubpub/blob/main/workers/queue.ts#L84-L86
