/**
 * Submission skeleton for a journal article.
 */
import skeletonize from '../skeletonize';

import { collaboratorsForPub, publishedDateForPub, sortedVersionsForPub, linkForPub } from './pub';
import { pubComponentDoi } from '../components';

const existsFor = ({ pub }) => !!pub;

const transformer = ({ globals, pub, community }) => {
	const { timestamp } = globals;
	const { title } = pub;
	const pubLink = linkForPub(community, pub);
	const sortedVersions = sortedVersionsForPub(pub);
	return {
		timestamp: timestamp,
		title: title,
		pubLink: pubLink,
		doi: pubComponentDoi(pub),
		sortedVersions: sortedVersions,
		collaborators: collaboratorsForPub(pub),
		publishedDate: publishedDateForPub(sortedVersions),
	};
};

const skeleton = ({
	doi,
	timestamp,
	title,
	collaborators,
	publishedDate,
	pubLink,
	sortedVersions,
}) => ({
	journal_article: {
		'@publication_type': 'full_text',
		titles: {
			title: title,
		},
		contributors: {
			person_name: collaborators.map((collaborator, collaboratorIndex) => {
				const personNameOutput = {
					'@sequence': collaboratorIndex === 0 ? 'first' : 'additional',
					'@contributor_role': collaborator.isAuthor ? 'author' : 'reader',
					given_name: collaborator.user.lastName ? collaborator.user.firstName : '',
					surname: collaborator.user.lastName
						? collaborator.user.lastName
						: collaborator.user.firstName,
				};
				if (!personNameOutput.given_name) {
					delete personNameOutput.given_name;
				}
				return personNameOutput;
			}),
		},
		publication_date: {
			'@media_type': 'online',
			month: `0${publishedDate.getMonth() + 1}`.slice(-2),
			day: publishedDate.getDate(),
			year: publishedDate.getFullYear(),
		},
		doi_data: {
			doi: doi,
			timestamp: timestamp,
			resource: pubLink,
		},
		component_list: {
			component: sortedVersions.map((version) => {
				const versionDate = new Date(version.createdAt);
				return {
					'@parent_relation': 'isPartOf',
					publication_date: {
						'@media_type': 'online',
						month: `0${versionDate.getMonth() + 1}`.slice(-2),
						day: versionDate.getDate(),
						year: versionDate.getFullYear(),
					},
					doi_data: {
						doi: `${doi}/${version.id.split('-')[0]}`,
						timestamp: timestamp,
						resource: `${pubLink}?version=${version.id}`,
					},
				};
			}),
		},
	},
});

export default skeletonize(transformer, skeleton, existsFor);
