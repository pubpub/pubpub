/**
 * Shared schema generation utilities for pubs
 */

const pubJSON = (pub) => pub.toJSON();

export const linkForPub = (communityData, pubData) => {
	const communityHostname = communityData.domain || `${communityData.subdomain}.pubpub.org`;
	return `https://${communityHostname}/pub/${pubData.slug}`;
};

export const sortedVersionsForPub = (pubData) =>
	pubData.versions.sort((foo, bar) => {
		if (foo.createdAt < bar.createdAt) {
			return -1;
		}
		if (foo.createdAt > bar.createdAt) {
			return 1;
		}
		return 0;
	});

export const publishedDateForPub = (sortedVersions) => {
	return new Date(sortedVersions[0].createdAt);
};

export const collaboratorsForPub = (pub) =>
	pubJSON(pub)
		.attributions.map((attribution) => {
			if (attribution.user) {
				return attribution;
			}
			return {
				...attribution,
				user: {
					id: attribution.id,
					initials: attribution.name[0],
					fullName: attribution.name,
					firstName: attribution.name.split(' ')[0],
					lastName: attribution.name
						.split(' ')
						.slice(1, attribution.name.split(' ').length)
						.join(' '),
					avatar: attribution.avatar,
					title: attribution.title,
				},
			};
		})
		.sort((foo, bar) => {
			if (foo.order < bar.order) {
				return -1;
			}
			if (foo.order > bar.order) {
				return 1;
			}
			return 0;
		});
