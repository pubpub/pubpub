import { MinimalFooterProps } from './MinimalFooter';

const defaultMinimalFooterProps: MinimalFooterProps = {
	leftItem: {
		title: 'Arcadia Research',
		url: '/',
		image: 'https://resize-v3.pubpub.org/eyJidWNrZXQiOiJhc3NldHMucHVicHViLm9yZyIsImtleSI6Il90ZXN0aW5nLzUxNjU1OTIyNDE5OTEwLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJoZWlnaHQiOjUwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9fX0=',
	},
	centerItems: {
		top: [
			{
				label: 'Arcadia Science',
				url: 'arcadiascience.com',
			},
			{
				label: 'Terms of Use',
				url: 'https://www.arcadia.science/terms-of-use',
			},
			{ label: 'Arcadia Privacy Policy', url: 'https://www.arcadia.science/privacy' },
			{ label: 'RSS', url: 'https://research.arcadiascience.com/rss.xml' },
			{ label: 'Legal', url: 'https://research.arcadiascience.com/legal' },
		],
		bottom: [{ label: 'Designed by And—Now. Built by TGHP' }],
	},
	rightItem: { label: 'Twitter', url: 'https://twitter.com/arcadiascience', icon: 'twitter' },
};

export default defaultMinimalFooterProps;
