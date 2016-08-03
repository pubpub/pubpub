# Atoms

Atoms are the fabric of the PubPub universe. 
On the backend, atoms are versioned JSON objects, but they work more like git repositories.
Just about everything, including images, datasets, references, and pubs themselves, are atoms.

This architecture is deliberately flat. 
There's no real sense of hierarchy in PubPub: every image and dataset has its own URL and exists independently of the pubs that it might appear in.
Atoms are designed to be composable, to make it easier to reference, view, and comment on individual components of a document.

Every atom has a `type`, and every `type` has a corresponding `viewer` and `editor`, which are React components exported from `/src/components/AtomTypes/index.js`.
These React components are loaded whenever we need to display or edit an atom, and receive the atom data as props.
In the future, we hope to dynamically require viewers and editors at runtime, but at the moment they're all included in the initial webpack chunk.

The easiest way to develop your own atom type is to extend one of the simpler existing ones, such as `Image` or `PDF`.

## Editors

Editors are React components that provide a intuitive, approachable way for a user to publish a new version of an atom.
This name is a bit misleading, since the publication history of any atom is permanent. 
There's no such thing as *editing* an atom, only publishing a new version of one.


#### Data
An editor doesn't need to display anything, but it's usually a good idea to render a preview of the current version (and a preview of the updated data).
Editors receive an `atomEditData` object in its props, which includes the contents of the atom's entire history.
The current version's data lives at `this.props.atomEditData.currentVersionData.content`.

#### Save Version Content
Editors must define a `this.getSaveVersionContent()` function, which must return an object that will be bound to the newest version of that atom.
Usually the new object should have the same keys as the `atomEditData.currentVersionData.content` that it received, but this isn't required.

## Viewers

Viewers are React components responsible for rendering the data of an atom.

#### Data
Viewers receive atom data in `this.props.atomData.currentVersionData.content`, and also receive a contextual render type in `this.props.renderType`.
Note that this is slightly different than schema for editors.

#### Render Type
The render type will be one of `'full'`, `'embed'`, `'static-full'`, or '`static-embed'`.
The viewer doesn't have to do anything with the render type, but should respect the context when possible.

