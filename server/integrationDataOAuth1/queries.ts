import * as types from 'types';

import { IntegrationDataOAuth1 } from 'server/models';

type UpdateOptions = Partial<types.Submission> & {
	id: string;
	accessToken: string;
};

export const updateIntegrationDataOAuth1 = (options: UpdateOptions, actorId: string) =>
	IntegrationDataOAuth1.update(
		{
			accessToken: options.accessToken,
		},
		{
			where: { id: options.id },
			individualHooks: true,
			actorId,
		},
	);

export const destroyIntegrationDataOAuth1 = ({ id }: { id: string }, actorId: string) =>
	IntegrationDataOAuth1.destroy({
		where: { id },
		individualHooks: true,
		actorId,
	});
