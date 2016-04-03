# Media Library

The Media Library holds all of the users assets (assets, references, highlights, etc). The Media Library

1. Let's a user view/edit/delete these assets
2. Let's a user insert an asset into a document
3. Let's a user add new assets

# Media Library Editor

The asset editor is the place where all asset type specifications are held,
in part because this is also where we need to be creating and updating assets.

# Asset Types

## Images (.jpg, .png, .gif)

```
assetType: 'image',
assetData: {
	filetype: { type: String}, // Original file extension, e.g. .jpg, .png, .csv
	originalFilename: { type: String}, // Original filename of the asset. Static for each file
	thumbnail: { type: String}, // Scaled version of the document.
	url: { type: String}, // Original - full-size version of the asset
}
```

## Video (.mp4, .ogg, .webm)

```
assetType: 'video',
assetData: {
	filetype: { type: String}, // Original file extension, e.g. .mp4, .ogg, .webm
	originalFilename: { type: String}, // Original filename of the asset. Static for each file
	thumbnail: { type: String}, // Scaled version of the document.
	url: { type: String}, // Original - full-size version of the asset
}
```
## Highlight

```
assetType: 'highlight',
assetData: {
	text: {type: String},
	context: {type: String},

	endContainerPath: {type: String},
	endOffset: {type: String},
	startContainerPath: {type: String},
	startOffset: {type: String},

	sourcePub: { type: ObjectId, ref: 'Pub' },
	sourceVersion: {type: Number},
}
```

## Reference

```
assetType: 'reference',
assetData: {
	// Many more fields could be added. We should list them all, and then provide a dropdown
	// for users on the frontend to select from the (exhaustive) options.
	title: { type: String },
	url: { type: String },
	author: { type: String },
	journal: { type: String },
	volume: { type: String },
	number: { type: String },
	pages: { type: String },
	year: { type: String },
	publisher: { type: String },
	doi: { type: String },
	note: { type: String },
}
```
