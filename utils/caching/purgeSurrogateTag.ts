/**
 * Purge a surrogate tag from Fastly
 *
 * @param tag The tag to purge, this should be the domain
 * @param duqduq Whether to purge the duqduq service or prod
 * @param soft Whether to do a soft purge. This marks the content as stale and will serve stale content while the new content is being fetched
 */
export const purgeSurrogateTag = async (tag: string, duqduq = false, soft = false) => {
	let id: string;
	try {
		const serviceId = duqduq
			? process.env.FASTLY_SERVICE_ID_DUQDUQ
			: process.env.FASTLY_SERVICE_ID_PROD;

		const purge = await fetch(`https://api.fastly.com/service/${serviceId}/purge/${tag}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Fastly-Key': process.env.PURGE_TOKEN!,
				...(soft ? { 'Fastly-Soft-Purge': '1' } : {}),
			},
		});

		const response = await purge.json();

		if (!response.status) {
			throw new Error(response.msg);
		}

		id = response.id as string;
	} catch (e) {
		console.error(e);
		throw new Error(e);
	}

	return id;
};
