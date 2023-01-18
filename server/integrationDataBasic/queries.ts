import * as types from 'types';

import { IntegrationDataBasic } from 'server/models';

type UpdateOptions = Partial<types.Submission> & {
	id: string;
	username: string;
	password: string;
};

export const updateIntegrationDataBasic = (options: UpdateOptions, actorId: string) =>
	IntegrationDataBasic.update(
		{
			username: options.username,
		},
		{
			where: { id: options.id },
			individualHooks: true,
			actorId,
		},
	);

export const destroyIntegrationDataBasic = ({ id }: { id: string }, actorId: string) =>
	IntegrationDataBasic.destroy({
		where: { id },
		individualHooks: true,
		actorId,
	});
