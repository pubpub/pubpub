# The Book of Facets

A **facet** is a kind of structured data that attaches to any kind of **scope**: a Community, Collection, or Pub. We have facets because we often want to unify a certain behavior across all scope kinds — for instance, to let any scope kind accept a certain metadata value. We also sometimes want to decouple where a property is _stored_ from where it is _used_ — for instance, we want to let users configure default values for Pub settings at the Community level.

At the highest level, facets are:

- Defined in a backend-agnostic way in the `facets/definitions` directory
- Mapped to Sequelize models (and thus database tables) in a predictable way
- Stored and retrieved with functions that abstract over Sequelize and Postgres
- ✨ _Cascading_ ✨ — values from parent scopes are used as defaults by their descendants
- Useful for storing serializable data — less so anything that requires associations or foreign keys
- Managed through a common set of UI primitives and React hooks on the frontend
- Readable to the world. Writable by any `Member` of a scope with `manage`-level permissions or higher.

If you haven't already, you should start by visiting `facets/definitions` to get a feel for how we define facets in practice.

## Motivation and history

Consider two throughlines of PubPub's evolution over the years:

- Users like that PubPub's unopinionated scope names — Community, Collection and Pub — can flex to cover periodicals, books, conferences, and especially bodies of work less easily categorized. But while the names are unopinionated, the implementations aren't. There is often a single "PubPub way" to do something that falls out of emergent behavior, but it isn't always discovered through experimentation or self-expression. For some users, our nouns feel like just another box.

- Users have always wanted "default Pub settings" to keep the look and feel of their Community consistent — if they prefer a certain Pub header style, and a certain citation format, they shouldn't have to configure those for each new Pub.