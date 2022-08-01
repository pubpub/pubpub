import { choosePrefixByCommunityId } from './communities';

const splitId = (item) => item.id.split('-')[0];

export const createComponentDoi = (parentPub, childPub) => {
	return `${parentPub.doi}/${splitId(childPub)}`;
};

export default async ({ community, target }) => {
	const communityPart = splitId(community);
	const targetPart = target ? `.${splitId(target)}` : '';
	const component = communityPart + targetPart;

	return `${await choosePrefixByCommunityId(community.id)}/${component}`;
};
