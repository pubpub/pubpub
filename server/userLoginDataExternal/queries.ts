import * as types from 'types';

import { UserLoginDataExternal } from 'server/models';

type CreateOptions = {
	userId: string;
	externalUsername: string;
	externalUserId: string;
	externalLoginProviderId: string;
	externalProviderToken: string;
};

type UpdateOptions = Partial<types.Submission> & {
	id: string;
	externalProviderToken: string;
};

export const createUserLoginDataExternal = ({
	userId,
	externalUserId,
	externalUsername,
	externalLoginProviderId,
	externalProviderToken,
}: CreateOptions): Promise<types.SequelizeModel<types.UserLoginDataExternal>> =>
	UserLoginDataExternal.create(
		{
			userId,
			externalUserId,
			externalUsername,
			externalLoginProviderId,
			externalProviderToken,
		},
		{ actorId: userId },
	);

export const updateUserLoginDataExternal = (options: UpdateOptions, actorId: string) =>
	UserLoginDataExternal.update(
		{
			externalProviderToken: options.externalProviderToken,
		},
		{
			where: { id: options.id },
			individualHooks: true,
			actorId,
		},
	);

export const destroyUserLoginDataExternal = ({ id }: { id: string }, actorId: string) =>
	UserLoginDataExternal.destroy({
		where: { id },
		individualHooks: true,
		actorId,
	});
