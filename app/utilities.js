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
import { navItems, accentDataDark } from '../stories/_data';

const viralData = {
	title: 'Viral Communications',
	description: 'Group publications and research docs from around the world all situated here in this little community.',
	avatar: 'http://www.fnordware.com/superpng/pnggrad16rgb.png',
	smallHeaderLogo: '/dev/viralLogo.png',
	largeHeaderLogo: '/dev/viralLogo.png',
	largeHeaderBackground: '/dev/homeBackground.png',
	navItems: navItems,
	accentData: accentDataDark,
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
