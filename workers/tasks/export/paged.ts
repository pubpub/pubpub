export const exportWithPaged = async (html: string) => {
	const response = await fetch(`${process.env.PUBSTASH_URL}/convert?format=pdf`, {
		method: 'POST',
		body: html,
		headers: { 'Content-Type': 'text/plain' },
	});
	return response.json();
};
