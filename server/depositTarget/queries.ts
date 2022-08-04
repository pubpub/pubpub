import * as types from 'types';
import { DepositTarget } from 'server/models';

export const getCommunityDepositTarget = (
	communityId: string,
	service: types.DepositTarget['service'] = 'crossref',
) => {
	return DepositTarget.findOne({
		where: {
			communityId,
			service,
		},
	});
};
