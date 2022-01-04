import { Op } from 'sequelize';

import * as types from 'types';
import { CollectionPub, Member } from 'server/models';
import { getMemberDataById } from 'server/utils/queryHelpers';

const assertExactlyOneScopeInTarget = ({ pubId, communityId, collectionId }) => {
	if ([pubId, communityId, collectionId].filter((x) => x).length !== 1) {
		throw new Error('Cannot create member with ambiguous scope.');
	}
};

export const createMember = async ({
	target: { pubId, collectionId, communityId, userId },
	value: { permissions },
	actorId = null,
}) => {
	assertExactlyOneScopeInTarget({
		pubId,
		communityId,
		collectionId,
	});
	const { id: memberId } = await Member.create(
		{
			userId,
			permissions,
			communityId,
			collectionId,
			pubId,
		},
		{ returning: ['id'], actorId },
	);
	return getMemberDataById(memberId);
};

type UpdateMemberOptions = {
	memberId: string;
	actorId: string | null;
	value: Partial<{
		permissions: ['view', 'edit', 'manage', 'admin'];
		receivesDigestEmail: boolean;
	}>;
};

export const updateMember = async (options: UpdateMemberOptions) => {
	const {
		memberId,
		actorId,
		value: { permissions, receivesDigestEmail },
	} = options;
	const existingMember = await Member.findOne({ where: { id: memberId } });
	await existingMember.update({ permissions, receivesDigestEmail }, { actorId });
	return existingMember;
};

export const destroyMember = ({ memberId, actorId = null }) => {
	return Member.destroy({ where: { id: memberId }, actorId, individualHooks: true });
};

export const getMembersForScope = async (
	scope: types.Scope,
): Promise<types.SequelizeModel<types.Member>[]> => {
	if ('pubId' in scope && scope.pubId) {
		const collectionPubs = await CollectionPub.findAll({
			where: { pubId: scope.pubId },
			attributes: ['collectionId'],
		});
		return Member.findAll({
			where: {
				[Op.or]: [
					{ communityId: scope.communityId },
					{ collectionId: { [Op.in]: collectionPubs.map((cp) => cp.collectionId) } },
					{ pubId: scope.pubId },
				],
			},
		});
	}
	if ('collectionId' in scope && scope.collectionId) {
		return Member.findAll({
			where: {
				[Op.or]: [{ communityId: scope.communityId }, { collectionId: scope.collectionId }],
			},
		});
	}
	return Member.findAll({ where: { communityId: scope.communityId } });
};
