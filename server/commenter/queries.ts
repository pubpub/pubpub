import { Commenter } from 'server/models';
import { Commenter as CommenterFields } from 'types';

export const createCommenter = ({ discussionId, name, threadId }: CommenterFields) => {
	return Commenter.create(
		{
			discussionId,
			threadId,
			name,
		},
		{ returning: true },
	);
};
