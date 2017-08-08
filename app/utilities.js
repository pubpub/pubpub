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
	description: 'This is about viral!',
	avatar: 'http://www.fnordware.com/superpng/pnggrad16rgb.png',
	// accentColor: '#6de85f',
	accentColor: '#111',
	// buttonColor
	// activeColor
	// isLight: use 'color' package server-side to calculate 
	// these values each time. Don't load this library to client.
	logo: 'https://i.imgur.com/SkiSe3E.png',
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
