/**
 * Renders a doi_data
 */
export default (doi, timestamp, resource) => ({
	doi_data: {
		doi: doi,
		timestamp: timestamp,
		resource: resource,
	},
});
