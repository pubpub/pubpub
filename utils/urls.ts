export const parseUrl = (url: string) => {
	try {
		return new URL(url);
	} catch (error) {
		return null;
	}
};

export const isExternalUrl = (url: string) => {
	return !url.startsWith('/');
};

export const addHttpsProtocol = (url: string) => {
	// eslint-disable-next-line no-useless-escape
	if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
		url = 'https://' + url;
	}
	return url;
};
