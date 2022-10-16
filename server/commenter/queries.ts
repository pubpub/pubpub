import { Commenter } from 'server/models';
import { Commenter as CommenterFields } from 'types';

export const createCommenter = (props: CommenterFields) => {
	return Commenter.create(
		{
			...props,
		},
		{ returning: true },
	);
};
