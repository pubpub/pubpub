import { isDuqDuq } from 'utils/environment';

/**
 * Purge a surrogate tag from Fastly
 *
 * @param tag The tag to purge, this should be the domain
 * @param soft Whether to do a soft purge. This marks the content as stale and will serve stale content while the new content is being fetched
 */
export const purgeSurrogateTag = async (tag: string, soft = false) => {
	let id: string;

	const duqduq = isDuqDuq();

	const serviceId = duqduq
		? process.env.FASTLY_SERVICE_ID_DUQDUQ
		: process.env.FASTLY_SERVICE_ID_PROD;

	const modifiedTag = duqduq ? tag.replace('pubpub.org', 'duqduq.org') : tag;
	try {
		const purge = await fetch(
			`https://api.fastly.com/service/${serviceId}/purge/${modifiedTag}`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Fastly-Key': process.env.PURGE_TOKEN!,
					...(soft ? { 'Fastly-Soft-Purge': '1' } : {}),
				},
			},
		);

		const response = await purge.json();

		if (response.status !== 'ok') {
			throw new Error(response.msg);
		}

		id = response.id as string;
	} catch (e: any) {
		console.error(e);
		throw new Error(e);
	}

	return id;
};
