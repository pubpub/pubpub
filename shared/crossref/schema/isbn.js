/**
 * Renders an isbn, or a noisbn if we don't have one.
 */

export default (isbn) => {
	if (isbn) {
		return { isbn: isbn };
	}
	return { noisbn: { '@reason': 'monograph' } };
};
