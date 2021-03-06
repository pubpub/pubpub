import app, { wrap } from 'server/server';
import { getPubDraftDoc } from 'server/utils/firebaseAdmin';

import { getPermissions } from './permissions';

const getRequestIds = (req) => {
	const user = req.user || {};
	const { pubId, communityId, historyKey, accessHash } = req.query;
	return {
		userId: user.id,
		pubId,
		communityId,
		historyKey: parseInt(historyKey, 10),
		accessHash,
	};
};

app.get(
	'/api/pubHistory',
	wrap(async (req, res) => {
		const { pubId, communityId, historyKey, accessHash, userId } = getRequestIds(req);
		const { canCreateExport } = await getPermissions({
			userId,
			communityId,
			pubId,
			accessHash,
			historyKey,
		});
		if (canCreateExport) {
			const draftDocInfo = await getPubDraftDoc(pubId, historyKey);
			return res.status(200).json(draftDocInfo);
		}
		return res.status(403).json({});
	}),
);
