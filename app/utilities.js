/* eslint-disable import/prefer-default-export */

export const apiFetch = function(path, opts) {
	const urlPrefix = 'https://api.github.com/users';
	const finalRoute = `${urlPrefix}/${path}/orgs`;

	return fetch(finalRoute, {
		...opts,
		// credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};
