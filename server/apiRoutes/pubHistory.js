import app from '../server';
import { getBranchDoc } from '../utils/firebaseAdmin';
import { Branch, BranchPermission, User } from '../models';

import { communityAdminFor } from './permissions/communityAdmin';
import { pubManagerFor } from './permissions/pubManager';
import calculateBranchPermissions from '../branchPermission/calculateBranchPermissions';

app.get('/api/pubHistory', async (req, res) => {
	try {
		const { branchId, pubId, communityId, accessHash, historyKey } = req.query;
		const { id: userId } = req.user;
		const branch = await Branch.findOne({
			include: [
				{
					model: BranchPermission,
					as: 'permissions',
					separate: true,
					required: false,
					include: [
						{
							model: User,
							as: 'user',
							attributes: ['id'],
						},
					],
				},
			],
		});
		const [communityAdmin, pubManager] = await Promise.all([
			communityAdminFor({ userId: userId, communityId: communityId }).catch(() => null),
			pubManagerFor({ userId: userId, pubId: pubId }).catch(() => null),
		]);
		const { canView } = calculateBranchPermissions(
			accessHash,
			branch,
			userId,
			!!communityAdmin,
			!!pubManager,
		);
		if (canView) {
			const { content } = await getBranchDoc(pubId, branchId, historyKey);
			return res.status(200).json(content);
		}
		return res.status(403).json({});
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
