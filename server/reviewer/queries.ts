import { Reviewer } from 'server/models';

export const createReviewer = (inputValues) => {
	return Reviewer.create({
		reviewId: inputValues.reviewId,
		name: inputValues.name,
	}).then((newReviewer) => {
		return Reviewer.findOne({
			where: { id: newReviewer.id },
		});
	});
};
