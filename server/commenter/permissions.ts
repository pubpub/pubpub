import { Pub } from 'server/models';
import * as types from 'types';

export const getPermissions = async ({ userId, pubId, commentAccessHash }) => {
	if (!userId || !pubId) {
		return {};
	}

	const pub: types.Pub = await Pub.findOne({ where: { id: pubId } });
	const hasAccessHash = pub?.commentHash === commentAccessHash;

	return { create: hasAccessHash };
};
