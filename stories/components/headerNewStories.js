import React from 'react';
import { storiesOf } from '@storybook/react';
import HeaderNew from 'components/HeaderNew/HeaderNew';
import { locationData, loginData } from '../data';

require('components/HeaderNew/headerNew.scss');

const wrapperStyle = { margin: '2em 1em', border: '1px solid #CCC' };

const communityData = {};

// title: 'toggl',
// smallLogo: 'https://assets.pubpub.org/_testing/71551104387305.png',
// headerLinks: [],

// useLargeHeader: true,
//	hideSmallLogo: false,

//	headerBackgroundColor: '#d4a3e1', (default is community accent)
//	headerBackgroundImage: undefined,
//		headerTextColor: '#fff', (default is community text color)
//		useGradient: false,
//
//	heroImage: 'https://assets.pubpub.org/_testing/31551104397980.png',
//	heroTitle: 'Where did time go?',
//	heroLogo: undefined,
//	heroText: 'Turn your team on to productivity with Toggl the time tracker.',
//	heroPrimaryButton: 'Sign Up',
//		heroSecondaryButton: 'Find out more',
//	heroAlign: 'center',

storiesOf('Components/HeaderNew', module).add('default', () => (
	<div>
		<div style={wrapperStyle}>
			<HeaderNew
				communityData={{
					...communityData,
					title: 'Hiptest',
					headerLinks: [
						{ title: 'About', url: '/about' },
						{ title: 'Pricing', url: '/pricing' },
						{
							title: 'Issues',
							children: [
								{ title: 'Issue 1 or so', url: '/whatever1' },
								{ title: 'Issue 2', url: '/whatever2' },
							],
						},
					],
					useLargeHeader: true,
					hideSmallLogo: false,
					headerBackgroundImage: undefined,
					// headerBackgroundColor: '#249',
					// headerTextColor: 'light',
					smallLogo: 'https://assets.pubpub.org/_testing/01551104299949.png',
					heroImage: 'https://assets.pubpub.org/_testing/31551104270100.png',
					heroTitle: 'Get to market faster with continuous testing',
					// heroLogo: 'https://assets.pubpub.org/_testing/01551104299949.png',
					heroText:
						'From idea to production, test your product continuously with Behavior Driven Development and Agile test management.',
					heroPrimaryButton: 'Start your free trial',
					heroSecondaryButton: 'Explore stuff',
					heroAlign: undefined,
				}}
				locationData={locationData}
				loginData={loginData}
			/>
		</div>
		<div style={wrapperStyle}>
			<HeaderNew
				communityData={{
					...communityData,
					hideSmallLogo: false,
					title: 'WHITEOUT',
					useLargeHeader: true,
					headerBackgroundImage: 'https://assets.pubpub.org/_testing/71551104341423.jpg',
					useGradient: true,
					headerBackgroundColor: undefined,
					headerTextColor: 'light',
					smallLogo: 'https://assets.pubpub.org/_testing/31551104320889.png',
					heroImage: undefined,
					heroTitle: undefined,
					heroLogo: 'https://assets.pubpub.org/_testing/71551104353671.png',
					heroText: undefined,
					heroPrimaryButton: undefined,
					heroSecondaryButton: undefined,
					heroAlign: 'center',
				}}
				locationData={locationData}
				loginData={loginData}
			/>
		</div>
		<div style={wrapperStyle}>
			<HeaderNew
				communityData={{
					...communityData,
					hideSmallLogo: false,
					title: 'Timepal',
					useLargeHeader: true,
					headerBackgroundImage: undefined,
					// headerBackgroundColor: '#026',
					// headerTextColor: 'light',
					smallLogo: 'https://assets.pubpub.org/_testing/41551104374754.png',
					heroImage: undefined,
					heroTitle: 'Automatic and manual time-tracking finally united',
					heroLogo: undefined,
					heroText: 'Stressless timekeeping became a reality',
					heroPrimaryButton: 'Download Free Trial',
					heroSecondaryButton: undefined,
					heroAlign: 'center',
				}}
				locationData={locationData}
				loginData={loginData}
			/>
		</div>
		<div style={wrapperStyle}>
			<HeaderNew
				communityData={{
					...communityData,
					hideSmallLogo: false,
					title: 'toggl',
					useLargeHeader: true,
					headerBackgroundImage: undefined,
					headerBackgroundColor: '#d4a3e1',
					smallLogo: 'https://assets.pubpub.org/_testing/71551104387305.png',
					heroImage: 'https://assets.pubpub.org/_testing/31551104397980.png',
					heroTitle: 'Where did time go?',
					heroLogo: undefined,
					heroText: 'Turn your team on to productivity with Toggl the time tracker.',
					heroPrimaryButton: 'Sign Up',
					heroSecondaryButton: 'Find out more',
					heroAlign: 'center',
				}}
				locationData={locationData}
				loginData={loginData}
			/>
		</div>
		<div style={wrapperStyle}>
			<HeaderNew
				communityData={{
					...communityData,
					hideSmallLogo: false,
					title: 'Simple Community',
					// useLargeHeader: true,
					// headerBackgroundImage: undefined,
					// headerBackgroundColor: '#d4a3e1',
					// smallLogo: 'https://assets.pubpub.org/_testing/71551104387305.png',
					// heroImage: 'https://assets.pubpub.org/_testing/31551104397980.png',
					// heroTitle: 'Where did time go?',
					// heroLogo: undefined,
					// heroText: 'Turn your team on to productivity with Toggl the time tracker.',
					// heroPrimaryButton: 'Sign Up',
					// heroSecondaryButton: 'Find out more',
					// heroAlign: 'center',
				}}
				locationData={locationData}
				loginData={loginData}
			/>
		</div>
	</div>
));
