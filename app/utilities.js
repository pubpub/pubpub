// export const apiFetch = function(path, opts) {
// 	const urlPrefix = 'https://api.github.com/users';
// 	const finalRoute = `${urlPrefix}/${path}/orgs`;

// 	return fetch(finalRoute, {
// 		...opts,
// 		// credentials: 'include',
// 	})
// 	.then((response)=> {
// 		if (!response.ok) {
// 			return response.json().then((err)=> { throw err; });
// 		}
// 		return response.json();
// 	});
// };


/* DEV ONLY */
/* -------- */

const viralData = {
	title: 'Viral Communications',
	description: 'Group publications and research docs from around the world all situated here in this little community.',
	avatar: 'http://www.fnordware.com/superpng/pnggrad16rgb.png',
	smallHeaderLogo: '/dev/viralLogo.png',
	largeHeaderLogo: '/dev/viralLogo.png',
	largeHeaderBackground: '/dev/homeBackground.png',
	navItems: [{ slug: '/', title: 'Home', id: 1, }, { slug: '/sensors', title: 'Sensors', id: 2, }, { id: 3.5, title: 'Issues', children: [{ slug: '/2017', title: '2017', id: 21, }, { slug: '/2016', title: '2016', id: 22, }, { slug: '/2018', title: 'Super Long 2018 Edition Extravaganza', id: 23, }] }, { slug: '/meeting-notes', title: 'Meeting-Notes', id: 3, }, { slug: '/blockchain', title: 'Blockchain', id: 4, }, { slug: '/new-ideas', title: 'New Ideas', id: 5, }, { slug: '/bad-ideas', title: 'Bad-Ideas', id: 6, }, { slug: '/submissions', title: 'Submissions', id: 7, }, { slug: '/about', title: 'About', id: 8, }],
	accentData: {
		accentColor: '#D13232',
		accentTextColor: '#FFF',
		accentActionColor: '#A72828',
		accentHoverColor: '#BC2D2D',
		accentMinimalColor: 'rgba(209, 50, 50, 0.15)',
	},
	userData: {
		fullName: 'Maggie Farnkrux',
		initials: 'MF',
		slug: 'maggiefarn',
		avatar: '/dev/maggie.jpg',
		isAdmin: true,
	}
};

export const apiFetch = function(path, opts) {
	return new Promise((resolve, reject) => {
		switch (path.split('?')[0]) {
		case '/api/app':
			if (path.indexOf('viral.pubpub') > -1) {
				return resolve(viralData);
			}
			return resolve({});
		default:
			return reject('404');
		}
	});
};
