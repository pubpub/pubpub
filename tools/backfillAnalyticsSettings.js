/* eslint-disable no-console */
import { Community, AnalyticsSettings } from 'server/models';
import { asyncMap } from 'utils/async';

async function main() {
	// batch fetch all communities
	// then for each community, create an analyticsSettings record

	let offset = 0;
	let done = false;

	const LIMIT = 200;

	while (!done) {
		console.log(`Fetching communities from ${offset} to ${offset + LIMIT}`);
		// eslint-disable-next-line no-await-in-loop
		const communities = await Community.findAll({
			limit: LIMIT,
			attributes: ['id'],
			offset,
			include: [
				{
					model: AnalyticsSettings,
					as: 'analyticsSettings',
				},
			],
		});

		console.log(`Creating analyticsSettings for ${communities.length} communities`);
		// eslint-disable-next-line no-await-in-loop
		const analyticsSettings = await asyncMap(
			communities,
			() =>
				AnalyticsSettings.create({
					type: 'default',
					credentials: null,
				}),
			{
				concurrency: 10,
			},
		);

		// eslint-disable-next-line no-await-in-loop
		await asyncMap(
			communities,
			(community, index) =>
				community.update({
					analyticsSettingsId: analyticsSettings[index].id,
				}),
			{
				concurrency: 10,
			},
		);

		console.log(
			`✅ Sucessfully backfilled analyticsSettings for communities ${offset} to ${
				offset + LIMIT
			}`,
		);

		if (communities.length !== LIMIT) {
			done = true;
			console.log(`✅ Sucessfully backfilled analyticsSettings for all communities`);
			break;
		}

		offset += LIMIT;
	}
}

main();
