import * as types from 'types';

import { Integration } from 'server/models';
import { upperCaseFirstLetter } from 'server/integration/queryHelpers';

type CreateOptions = {
	name: string;
	userId: string;
	integrationId: string;
	authSchemeName: string;
	externalUserData: types.IntegrationUserData;
	accessToken: string;
	integrationData?: object;
};

type UpdateOptions = Partial<types.Submission> & {
	id: string;
	accessToken: string;
};

export const createIntegration = ({
	name,
	userId,
	externalUserData,
	authSchemeName,
	integrationData,
}: CreateOptions): Promise<types.SequelizeModel<types.Integration>> => {
	if (!authSchemeName) return Promise.reject(new Error('no auth type specified'));
	return Integration.create(
		{
			name,
			userId,
			externalUserData,
			authSchemeName,
			[`integrationData${upperCaseFirstLetter(authSchemeName)}`]: integrationData,
		},
		{ actorId: userId },
	);
};

export const updateIntegration = (options: UpdateOptions, actorId: string) =>
	Integration.update(
		{
			accessToken: options.accessToken,
		},
		{
			where: { id: options.id },
			individualHooks: true,
			actorId,
		},
	);

export const destroyIntegration = ({ id }: { id: string }, actorId: string) =>
	Integration.destroy({
		where: { id },
		individualHooks: true,
		actorId,
	});
