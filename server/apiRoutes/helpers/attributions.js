/**
 * Helper functions for interacting with attribution models
 * (e.g. PubAttribution, CollectionAttribution)
 */
import { User } from '../../models';

const CAN_UPDATE_ATTRIBUTES = ['name', 'avatar', 'title', 'order', 'isAuthor', 'roles'];

const INCLUDE_USER_ATTRIBUTES = {
	model: User,
	as: 'user',
	required: false,
	attributes: ['id', 'firstName', 'lastName', 'fullName', 'avatar', 'slug', 'initials', 'title'],
};

export default (AttributionModel, testPermissions) => (permissionsInput) =>
	testPermissions(permissionsInput).then(() => ({
		createAttribution: (attribution) =>
			AttributionModel.create(attribution)
				.then((newAttribution) =>
					AttributionModel.findOne({
						where: { id: newAttribution.id },
						attributes: { exclude: ['updatedAt'] },
						include: [INCLUDE_USER_ATTRIBUTES],
					}),
				)
				.then((newModelWithUser) => newModelWithUser.toJSON()),
		updateAttribution: (modelId, requestToUpdate) => {
			const updatedAttribution = {};
			Object.keys(requestToUpdate).forEach((key) => {
				if (CAN_UPDATE_ATTRIBUTES.includes(key)) {
					updatedAttribution[key] = requestToUpdate[key];
				}
			});
			return AttributionModel.update(updatedAttribution, { where: { id: modelId } });
		},
		destroyAttribution: (modelId) => AttributionModel.destroy({ where: { id: modelId } }),
	}));
