type PubPreviewType = 'minimal' | 'small' | 'medium' | 'large';
type PubSortOrder = 'latest' | 'collection-rank';
type BannerButtonType = 'create-pub' | 'signup' | 'link';
type TextAlign = 'left' | 'center';

export type PubsContentOptions = {
	hideByline?: boolean;
	hideContributors?: boolean;
	hideDates?: boolean;
	hideDescription?: boolean;
	hideEdges?: boolean;
	limit?: number;
	pubPreviewType: PubPreviewType;
};

export type LayoutOptions = {
	isNarrow: boolean;
};

export type LayoutBlockPubs = {
	type: 'pubs';
	content: PubsContentOptions & { title?: string; pubIds: string[] };
};

export type LayoutBlockCollection = {
	type: 'collection';
	content: PubsContentOptions & { sort: PubSortOrder };
};

export type LayoutBlockText = {
	type: 'text';
	content: {
		text?: string;
		align?: TextAlign;
	};
};

export type LayoutBlockHtml = {
	type: 'html';
	content: {
		html?: string;
	};
};

export type LayoutBlockBanner = {
	type: 'banner';
	content: {
		align?: TextAlign;
		backgroundColor?: string;
		backgroundHeight?: 'tall' | 'narrow';
		backgroundImage?: string;
		backgroundSize?: 'full' | 'standard';
		buttonText?: string;
		buttonType?: BannerButtonType;
		buttonUrl?: string;
		showButton?: boolean;
		text?: string;
	};
};

// TODO(ian): Remove after migration
export type LayoutBlockPages = {
	type: 'pages';
	content: {
		pageIds: string[];
		title?: string;
	};
};

export type LayoutBlockCollectionsPages = {
	type: 'collections-pages';
	content: {
		items: { type: 'collection' | 'page'; id: string }[];
		title?: string;
	};
};

export type LayoutBlock =
	| LayoutBlockBanner
	| LayoutBlockCollection
	| LayoutBlockCollectionsPages
	| LayoutBlockHtml
	| LayoutBlockPages
	| LayoutBlockPubs
	| LayoutBlockText;

export type CollectionLayout = LayoutOptions & { blocks: LayoutBlock[] };
