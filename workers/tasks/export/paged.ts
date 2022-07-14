export const exportWithPaged = async (staticHtml) => {
	return fetch(`${process.env.PUBSTASH_URL}/convert?format=pdf`, {
		method: 'POST',
		body: staticHtml,
		headers: {
			'Content-Type': 'text/plain',
		},
	});
};
