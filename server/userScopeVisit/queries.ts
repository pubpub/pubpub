import { UserScopeVisit } from 'server/models';

export const createUserScopeVisit = (inputValues) => {
	const { userId, pubId, collectionId, communityId } = inputValues;
	return UserScopeVisit.create({
		userId,
		pubId,
		collectionId,
		communityId,
	});
};

export const getUserScopeVisits = ({ userId, communityId }) => {
	return UserScopeVisit.findAll({
		where: { userId, communityId },
		order: [['createdAt', 'DESC']],
		limit: 10,
	});
};
