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

- Users like that PubPub's unopinionated scope names — Community, Collection and Pub — can flex to cover periodicals, books, conferences, and works less easily categorized. But while the names are unopinionated, the implementations aren't. There is often a single "PubPub way" to do something that falls out of emergent behavior, but it isn't always discovered through experimentation or self-expression. For some users, our nouns feel like just another box.

- Users have always wanted "default Pub settings" to keep the look and feel of their Community consistent — if they prefer a certain Pub header style, and a certain citation format, they shouldn't have to configure those for each new Pub.

Facets were born from the implementation of "default Pub settings" in the second point, but they are also a big step towards addressing the first. With facets, we aim to grow the set of capabilities shared by all scopes, giving users more ways to structure their Communities. In time, the practical differences between our scope types may become a blurry formality. We might even choose to migrate them to a generic `Scope` that has no properties until facets are applied to it.

In that vein, we think about Facets as the seed of a "structurally-typed CMS": a publishing platform with a single generic content type, whose instances are distinguished _structurally_, by the properties they happen to have, rather than _nominally_, e.g. because they are intrinsically a Community, Collection, or Pub.

_You might like to skim [Everything is a Facet](https://notes.knowledgefutures.org/pub/tmn1hqhi/) and [Everything is a Scope](https://notes.knowledgefutures.org/pub/8fafd9il/) for some early thinking on this topic._

## A maxim

Here's a rule that, if you let it percolate while you sleep, explains a lot about how facets work:

> Every scope has exactly one value for every facet.

This is true even if the scope is brand-new, and there's no

Here are three things that you might informally refer to as a "facet". It's fine to do this, but these names help disambiguate them.

- A **facet definition** is a JavaScript object that describes the properties that a kind of facet has. We derive a TypeScript type and a Sequelize-backed database table from this.
- A **facet instance** is a JavaScript object that satisfies that type, or fits into that database table. All of its properties are nullable.
- A **facet cascade result** is the result of taking facets from nested scopes and cascading them "downwards", typically so that results at lower scopes take precedence.



## Anatomy of a facet definition

I'm omitting some TypeScript generics-plumbing for the sake of readability, here, and I'll speak somewhat loosely about types. TL;DR:

- A `FacetDefinition` is made of a name, label, and some `FacetProps`.
- A `FacetProp` is made of a name, label, some defaults, and a `FacetPropType`.
- A `FacetPropType` is a wrapper around a [`zod`](https://github.com/colinhacks/zod) type definition. We derive a TS and a Postgres type from it.

Feel free to allow along using the examples in `facets/definitions`.

### Defining a facet

The `facet()` function is used to create a facet definition:

```ts
facet({
    name: string,
    label?: string
    props: Record<string, FacetPropType>,
}): FacetDefinition
```

It takes as arguments:

- A `name` for the facet. By convention, this is `PascalCased`.
- An optional `label` for the facet — a very short description that may appear in the UI.
- A `props` that describe its properties.

By convention, a facet is exported from `facets/definitions/index.ts` using a symbol name that matches its `name` property. (This is important, and is something we could choose to enforce programmatically in the future.)

<details>
<summary>
<strong>Example: the <code>PubHeaderTheme</code> definition</strong>
</summary>

Here's a the actual definition of the `PubHeaderTheme` facet at the time of writing. We'll dive into parts of this throughout this section.

```ts
import { prop, facet, string, choice } from '../core';

const textStylePropType = choice(['dark', 'light', 'black-blocks', 'white-blocks']);

export const PubHeaderTheme = facet({
	name: 'PubHeaderTheme',
	label: 'Pub header theme',
	props: {
		backgroundImage: prop(string, { label: 'Background image', rootValue: null }),
		backgroundColor: prop(string, { label: 'Background color', rootValue: 'community' }),
		textStyle: prop(textStylePropType, { label: 'Text style', rootValue: 'light' }),
	},
});
```

</details>

### Defining facet props

The `prop()` function is used to define a facet prop:

```ts
prop(propType: FacetPropType, options: {
    label: string,
    rootValue: null | T,
    defaultValue?: null | T,
    cascade?: CascadeStrategy,
}): FacetProp
```

The `propType` argument is (and must be) a JavaScript object, _not_ a TypeScript type. From it, we infer `T`, a TypeScript type corresponding to `propType` (more on the why and how of this soon). The rest of the prop definition is:

- A `label` which is short, human-readable, and may appear in the UI.
- A `defaultValue` used as a default when calling `createFacetInstance()`.
- A `rootValue` that can be used as the top of the cascade. This is also a kind of default value, and might be what users think of as the "default" — it's the value the prop takes on if it's not specified at any specific scope.
- a `cascade` value that explains how the prop should cascade from scope to scope.

(To learn more about `rootValue` and `cascade`, see the section on Cascading, below.)

A `FacetProp` doesn't intrinsically have a name — this is provided by the keys of a `FacetDefinition`'s `props` object. So you _could_ reuse a single facet prop definition among multiple facet definitions, if it made sense to do so.

<details>
<summary>
<strong>Example: the <code>backgroundImage</code> prop</strong>
</summary>

Let's focus on the `textStyle` prop from `PubHeaderTheme`. Broken out, it's:

```ts
import { prop, facet, string, choice } from '../core';

const textStylePropType = choice(['dark', 'light', 'black-blocks', 'white-blocks']);
const textStyle = prop(textStyle, { label: 'Text style', rootValue: 'light' });
```

Consider the relationship between `textStylePropType` and `rootValue` here. The `choice()` function creates a `FacetPropType` that corresponds to the TypeScript type `'dark' | 'light' | 'black-blocks' | 'light-blocks'`. Our TypeScript plumbing then enforces that `rootValue` takes one of those values.

</details>

## Defining facet prop types

The `propType()` function defines a facet prop type:

```ts
propType({
    name: string,
    schema: zod.Schema,
    postgresType: string,
    extension?: Record<string, any>,
}): FacetPropType
```

Taking these values:

- `name` is a string that exists for debugging purposes.
- `schema` is a zod schema (e.g. `z.string()`) that defines this type.
- `postgresType` is the Postgres datatype that we'll use to store values of this `propType` in the database. It must accept a JSON-serialized version of `schema` — so it will probably be `'jsonb'` unless it's a scalar type.
- `extension` holds some context-specific extras that application code can use. This is usually duplicating some of the internals of `schema`, which is closed for inspection after it's created.

The `facets/core/primitives.ts` file holds prop types for your usual scalar types: strings, booleans, and numbers. You'll want to import and reuse those instead of re-rolling them. Thus, future uses of `propType()` should probably be for specific JSON object shapes — the `NodeLabels` facet has some good examples of non-scalar facet prop types.

<details>
<summary>
<strong>Example: the <code>integer</code> prop type</strong>
</summary>

Here's the interesting (if not particularly complicated) `FacetPropType` to represent integers.

```ts
export const integer = propType({
	name: 'integer',
	schema: z.number().int(),
	postgresType: 'integer',
});
```

</details>

## Wait, what is `zod` and why are we using it?

[`zod`](https://github.com/colinhacks/zod) lets us define TypeScript types (compile-time constructs which are erased at runtime) using JavaScript objects (which can be examined at runtime). It gives us runtime and compile-time versions of a type that are kept in lockstep. Here is a minimal Zod example:

```ts
import { z } from "zod";

const User = z.object({ username: z.string() });
type User = z.infer<typeof User>; // { username: string }
```

This seems backwards at first; why define types with runtime objects? _Because you can't do it the other way around:_ there is a `typeof` operator in TS that lets you infer a type from a runtime object, but nothing that lets you do the opposite.

Zod is a well-tested, widely-used elaboration on this idea. It's _great_ for Facets because we want good TypeScript coverage, but we also want to construct database tables and parse objects against a schema at runtime.