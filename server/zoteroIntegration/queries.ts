import { ZoteroIntegration, IntegrationDataOAuth1 } from 'server/models';

export const destroyZoteroIntegration = (id: string, actorId: string) =>
	ZoteroIntegration.findOne({
		where: { id },
		include: { model: IntegrationDataOAuth1, required: false },
	}).then((integration) =>
		IntegrationDataOAuth1.destroy({
			where: { id: integration.integrationDataOAuth1Id },
			individualHooks: true,
			actorId,
		}),
	);
/*
ZoteroIntegration.destroy({
	where: { id },
	individualHooks: true,
	actorId,
});
	 */
