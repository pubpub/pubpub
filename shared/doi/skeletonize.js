export const maybe = (maybeObject) => {
	if (typeof maybeObject === 'object') {
		return maybeObject;
	}
	return {};
};

export default (transformer, skeleton, existsFor = null) => (contentTuple) => {
	if (!(existsFor && existsFor(contentTuple))) {
		return {};
	}
	return skeleton(contentTuple, transformer(contentTuple));
};
