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

export function hexToRGB(hex) {
	// Ensure 6-char hex value 
	const formattedHex = hex.length === 7 ? hex : `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
	return result ? {
		R: parseInt(result[1], 16),
		G: parseInt(result[2], 16),
		B: parseInt(result[3], 16)
	} : {};
}

// Accepts Hex background color
// e.g. #FFF, #1287f3, #001177
export function contrastText(bgColor) {
	if (bgColor === 'transparent') {
		return '#333';
	}

	const nThreshold = 105;
	const components = hexToRGB(bgColor);
	const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

	return ((255 - bgDelta) < nThreshold) ? '#333' : '#EEE';
}

export function calculateHues(hex) {
	const formattedHex = hex.length === 7 ? hex : `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
	const rgb = hexToRGB(formattedHex);
	const calculateHue = function(numerator, denominator) {
		const ratio = numerator / denominator;
		return `rgb(${Math.round(ratio * rgb.R)}, ${Math.round(ratio * rgb.G)}, ${Math.round(ratio * rgb.B)})`;
	};
	return [
		calculateHue(12, 10),
		calculateHue(11, 10),
		calculateHue(10, 10),
	];
}

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
	// isLight: use 'color' package server-side to calculate these values each time. Don't load this library to client.
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
