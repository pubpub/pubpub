import { Discussion, ReviewNew, Visibility } from 'server/models';

export const getMatchingDiscussion = (id, threadId, pubId) =>
	Discussion.findOne({
		where: { id, threadId, pubId },
		include: [{ model: Visibility, as: 'visibility' }],
	});

export const getMatchingReview = (id, threadId, pubId) =>
	ReviewNew.findOne({
		where: { id, threadId, pubId },
		include: [{ model: Visibility, as: 'visibility' }],
	});

export const canUserInteractWithParent = (parent, canView) => {
	const { visibility } = parent;
	if (visibility.access === 'public') {
		return true;
	}
	if (visibility.access === 'members') {
		return canView;
	}
	return false;
};

export const userEditableFields = ['text', 'content'];
