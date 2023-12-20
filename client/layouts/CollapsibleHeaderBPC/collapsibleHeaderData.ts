import { CollapsibleHeaderProps } from './CollapsibleHeader';

export default {
	logo: {
		titleText: 'Biophysics Colab home page',
		url: '/',
		sourceProps: {
			srcSet: 'https://sciety.org/static/images/home-page/biophysics-colab.png',
			type: 'image/png',
		},
		imgProps: {
			src: 'https://sciety.org/static/images/home-page/biophysics-colab.png',
			alt: 'Biophysics Colab logo',
		},
	},
	headerNavLeft: [
		{ url: '/', title: 'Home' },
		{ url: '/about', title: 'About' },
	],
	headerNavRight: [
		{ title: 'Search', url: '/search', icon: 'search' },
		{ title: 'Submit your research', url: '/submit-your-research', isButton: true },
	],
	menuNav: [
		[
			{ isMobileOnly: true, url: '/', title: 'Home' },
			{ isMobileOnly: true, url: '/about', title: 'About' },
		],
		[{ isMobileOnly: true, url: '/search', title: 'Search' }],
	],
	twitterUrl: '',
} as CollapsibleHeaderProps;
