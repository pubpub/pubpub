/**
 * Renders a component list (useful for indicating the relationship between a pub and its versions)
 */
import date from './helpers/date';

export default (sortedVersions, timestamp, getDoi, getResourceUrl) => ({
	component_list: {
		component: sortedVersions.map((version) => {
			const versionDate = new Date(version.createdAt);
			return {
				'@parent_relation': 'isPartOf',
				...date('publication_date', versionDate),
				doi_data: {
					doi: getDoi(version),
					timestamp: timestamp,
					resource: getResourceUrl(version),
				},
			};
		}),
	},
});
