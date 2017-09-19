export const apiFetch = function(path, opts) {
	// const urlPrefix = 'https://pubpub-api-v4-dev.herokuapp.com';
	const urlPrefix = 'http://localhost:9876';
	const finalRoute = `${urlPrefix}${path}`;

	return fetch(finalRoute, {
		...opts,
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

export const nestDiscussionsToThreads = function(discussions) {
	const maxThreadNumber = discussions.reduce((prev, curr)=> {
		if (curr.threadNumber > prev) { return curr.threadNumber; }
		return prev;
	}, 0);

	const tempThreads = new Array(maxThreadNumber).fill([]);
	discussions.forEach((item)=> {
		tempThreads[item.threadNumber - 1] = [...tempThreads[item.threadNumber - 1], item];
	});

	return tempThreads.filter((item)=> { return item.length; });
};

export const populateNavigationIds = function(collections, navigation) {
	const collectionsObject = {};
	collections.forEach((item)=> {
		collectionsObject[item.id] = item;
	});
	return navigation.map((item)=> {
		if (item.children) {
			return {
				...item,
				children: item.children.map((child)=> {
					return collectionsObject[child];
				})
			};
		}
		return collectionsObject[item];
	});
};

/* DEV ONLY */
/* This will be removed once connected to API */
/* -------- */

// import { pubData, pubVersions, pubCollaborators, pubBody } from '../stories/_data';

// const viralData = {
// 	title: 'Viral Communications',
// 	description: 'Group publications and research docs from around the world all situated here in this little community.',
// 	avatar: 'https://i.imgur.com/JAeVwYn.png',
// 	smallHeaderLogo: '/dev/viralLogo.png',
// 	largeHeaderLogo: '/dev/viralLogo.png',
// 	largeHeaderBackground: '/dev/homeBackground.png',
// 	collections: [
// 		// title
// 		// slug
// 		// isPublic
// 		// isPage
// 		// id
// 		// creationHash
// 		// submissionsOpen
// 		// description
// 		// layout

// 		// Trying to get collections ordered in the way they are in the nav
// 		// Challenges are: 
// 		// Do we force every page/collection to be in the nav? Prob not
// 		// How do we save nav data so it is updated when links/title change? Prob store just id
// 		// Which means we need to populate the nav with real content
// 		// Then, flatten it - and use that as collections
// 		// Then take any collections that aren't used and append them alphabetically
// 		// Can't do the population server-side because we want titles updates as they go.
// 		// Need to reorder collections as nav changes (this would require a save, though).

// 		// console.log(appData.navItems);
// 		// const flatNavItems = appData.navItems.reduce((prev, curr) => {
// 		// 	return prev.concat(curr.children ? curr.children : curr, []);
// 		// }, []);
// 		// console.log(flatNavItems);
// 		// const collectionsObject = {};
// 		// appData.collections.forEach((collection)=> {
// 		// 	collectionsObject[collection.slug] = collection;
// 		// });
// 		// console.log(collectionsObject);
// 		// const orderedCollections = flatNavItems.map((item)=> {
// 		// 	return collectionsObject[item.slug] || item;
// 		// });
// 		// console.log(orderedCollections);
// 		{ title: 'Home', slug: '', isPublic: true, isPage: false, id: 3 },
// 		{ title: 'About', slug: 'about', isPublic: true, isPage: true, id: 4 },
// 		{ title: 'Submissions', slug: 'submissions', isPublic: true, isPage: false, id: 5 },
// 		{ title: 'Sensors', slug: 'sensors', isPublic: true, isPage: false, id: 6 },
// 		{ title: '2017', slug: '2017', isPublic: true, isPage: false, id: 7 },
// 		{ title: '2016', slug: '2016', isPublic: true, isPage: false, id: 8 },
// 		{ title: '2015', slug: '2015', isPublic: true, isPage: false, id: 9 },
// 		{ title: 'Meeting Notes', slug: 'meeting-notes', isPublic: false, isPage: false, id: 10 },
// 		{ title: 'Super Long 2018 Edition Extravaganza', slug: '2018', isPublic: true, isPage: false, id: 11 },

// 		// { title: 'Home', slug: 'home 1', isPublic: true, isPage: false, id: 13 },
// 		// { title: 'About', slug: 'about', isPublic: true, isPage: true, id: 14 },
// 		// { title: 'Submissions', slug: 'submissions', isPublic: true, isPage: false, id: 15 },
// 		// { title: 'Sensors', slug: 'sensors', isPublic: true, isPage: false, id: 16 },
// 		// { title: '2017', slug: '2017', isPublic: true, isPage: false, id: 17 },
// 		// { title: '2016', slug: '2016', isPublic: true, isPage: false, id: 18 },
// 		// { title: '2015', slug: '2015', isPublic: true, isPage: false, id: 19 },
// 		// { title: 'Meeting Notes', slug: 'meeting-notes', isPublic: false, isPage: false, id: 110 },
// 		// { title: 'Super Long 2018 Edition Extravaganza', slug: '2018', isPublic: true, isPage: false, id: 111 },

// 		// { title: 'Home', slug: 'home2', isPublic: true, isPage: false, id: 23 },
// 		// { title: 'About', slug: 'about', isPublic: true, isPage: true, id: 24 },
// 		// { title: 'Submissions', slug: 'submissions', isPublic: true, isPage: false, id: 25 },
// 		// { title: 'Sensors', slug: 'sensors', isPublic: true, isPage: false, id: 26 },
// 		// { title: '2017', slug: '2017', isPublic: true, isPage: false, id: 27 },
// 		// { title: '2016', slug: '2016', isPublic: true, isPage: false, id: 28 },
// 		// { title: '2015', slug: '2015', isPublic: true, isPage: false, id: 29 },
// 		// { title: 'Meeting Notes', slug: 'meeting-notes', isPublic: false, isPage: false, id: 210 },
// 		// { title: 'Super Long 2018 Edition Extravaganza', slug: '2018', isPublic: true, isPage: false, id: 211 },
// 	],
// 	navItems: [{ slug: '', title: 'Home', id: 1, }, { slug: 'sensors', title: 'Sensors', id: 2, }, { id: 3.5, title: 'Issues', children: [{ slug: '2017', title: '2017', id: 21, }, { slug: '2016', title: '2016', id: 22, }, { slug: '2018', title: 'Super Long 2018 Edition Extravaganza', id: 23, }] }, { slug: 'meeting-notes', title: 'Meeting-Notes', id: 3, }, { slug: 'blockchain', title: 'Blockchain', id: 4, }, { slug: 'new-ideas', title: 'New Ideas', id: 5, }, { slug: 'bad-ideas', title: 'Bad-Ideas', id: 6, }, { slug: 'submissions', title: 'Submissions', id: 7, }, { slug: 'about', title: 'About', id: 8, }],
// 	accentData: {
// 		accentColor: '#D13232',
// 		accentTextColor: '#FFF',
// 		accentActionColor: '#A72828',
// 		accentHoverColor: '#BC2D2D',
// 		accentMinimalColor: 'rgba(209, 50, 50, 0.15)',
// 	},
// 	userData: {
// 		fullName: 'Maggie Farnkrux',
// 		initials: 'MF',
// 		slug: 'maggiefarn',
// 		avatar: '/dev/maggie.jpg',
// 		isAdmin: true,
// 	}
// };

// // export const apiFetch = function(path, opts) {
// // 	return new Promise((resolve, reject) => {
// // 		switch (path.split('?')[0]) {
// // 		// case '/app':
// // 		// 	if (path.indexOf('viral.pubpub') > -1) {
// // 		// 		return resolve(viralData);
// // 		// 	}
// // 		// 	return resolve({});
// // 		// case '/collection/slug=':
// // 		// 	return resolve({ title: 'Home', });
// // 		// case '/collection/slug=about':
// // 		// 	return resolve({ title: 'About', });
// // 		// case '/collection/slug=sensors':
// // 		// 	return resolve({ title: 'Sensors', });
// // 		// case '/pub':
// // 		// 	return resolve({
// // 		// 		pub: pubData,
// // 		// 		versions: pubVersions,
// // 		// 		collaborators: pubCollaborators,
// // 		// 		body: pubBody,
// // 		// 	});
// // 		default:
// // 			return reject('404');
// // 		}
// // 	});
// // };
