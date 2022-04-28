import ensureUserForAttribution from 'utils/ensureUserForAttribution';
import { joinOxford } from 'utils/strings';
import { Attribution, AttributionWithUser, Collection, Pub } from 'types';
import { getPrimaryCollection } from './collections/primary';

const orderedContributors = (maybeContributors: Attribution[] | undefined | null) =>
	(maybeContributors || []).concat().sort((a, b) => {
		if (a.order !== b.order) {
			return a.order - b.order;
		}
		if (a.createdAt && b.createdAt && b.createdAt !== a.createdAt) {
			return b.createdAt.toString() > a.createdAt.toString() ? 1 : -1;
		}
		return 0;
	});

const resolveContributors = (
	contributors: AttributionWithUser[],
	hideAuthors: boolean,
	hideNonAuthors: boolean,
) => {
	const outputContributors = contributors.filter((attribution) => {
		if (hideAuthors && attribution.isAuthor) {
			return false;
		}
		if (hideNonAuthors && !attribution.isAuthor) {
			return false;
		}
		return true;
	});

	const uniqueAuthorIds: string[] = [];
	return outputContributors.filter((attribution) => {
		if (uniqueAuthorIds.includes(attribution.user.id)) {
			return false;
		}
		uniqueAuthorIds.push(attribution.user.id);
		return true;
	});
};

export const getAllPubContributors = (
	pubData: Pub,
	hideAuthors = false,
	hideNonAuthors = false,
) => {
	const { collectionPubs } = pubData;
	const primaryCollection = collectionPubs && getPrimaryCollection(collectionPubs);
	const contributors = [
		...orderedContributors(pubData.attributions),
		...orderedContributors(primaryCollection && primaryCollection.attributions),
	].map(ensureUserForAttribution);

	return resolveContributors(contributors, hideAuthors, hideNonAuthors);
};

export const getAllPubContributorsRoles = (
	pubData: Pub,
	role: string,
	hideAuthors = false,
	hideNonAuthors = false,
) => {
	const { collectionPubs } = pubData;
	const primaryCollection = collectionPubs && getPrimaryCollection(collectionPubs);

	const contributors = [
		...orderedContributors(pubData.attributions),
		...orderedContributors(primaryCollection && primaryCollection.attributions),
	].map(ensureUserForAttribution);

	// filter if role is present on contributor
	if (role === 'editor') {
		const contributorsWithRoles = contributors.filter((contributor) => {
			return (
				(contributor.roles && contributor.roles[0] === 'Editor') ||
				(contributor.roles && contributor.roles[0] === 'Writing – Review & Editing')
			);
		});
		return resolveContributors(contributorsWithRoles, hideAuthors, hideNonAuthors);
	}
	if (role === 'illustrator') {
		const contributorsWithRoles = contributors.filter((contributor) => {
			return (
				(contributor.roles && contributor.roles[0] === 'Illustrator') ||
				(contributor.roles && contributor.roles[0] === 'Visualization')
			);
		});

		return resolveContributors(contributorsWithRoles, hideAuthors, hideNonAuthors);
	}
	const contributorsWithRoles = contributors.filter((contributor) => {
		return contributor.roles && contributor.roles[0] === role;
	});
	return resolveContributors(contributorsWithRoles, hideAuthors, hideNonAuthors);
};

export const getAllCollectionContributors = (
	collectionData: Collection,
	hideAuthors = false,
	hideNonAuthors = false,
) => {
	return resolveContributors(
		orderedContributors(collectionData.attributions).map(ensureUserForAttribution),
		hideAuthors,
		hideNonAuthors,
	);
};

export const getContributorName = (attribution: Attribution) => {
	if (attribution.user) {
		return attribution.user.fullName;
	}
	return attribution.name;
};

export const getAuthorString = (pub) => {
	const contributors = getAllPubContributors(pub, false, true);
	return joinOxford(contributors.map((c) => c.user.fullName));
};
