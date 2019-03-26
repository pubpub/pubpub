/**
 * Renders a list of contributors
 */
export default (attributions) => ({
	contributors: {
		person_name: attributions.map((attribution, attributionIndex) => {
			const personNameOutput = {
				'@sequence': attributionIndex === 0 ? 'first' : 'additional',
				'@contributor_role': attribution.isAuthor ? 'author' : 'reader',
				given_name: attribution.user.lastName ? attribution.user.firstName : '',
				surname: attribution.user.lastName
					? attribution.user.lastName
					: attribution.user.firstName,
			};
			if (!personNameOutput.given_name) {
				delete personNameOutput.given_name;
			}
			return personNameOutput;
		}),
	},
});
