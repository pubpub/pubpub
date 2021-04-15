import { UserScopeVisit } from 'server/models';

export const createUserScopeVisit = (inputValues) => {
	const { userId, pubId, communityId } = inputValues;
	return UserScopeVisit.create({
		userId,
		pubId,
		communityId,
	});
};
