import { sanitizeOnVisibility } from './util';

const isAuthorSpam = (author: { spamTag?: { status?: string } } | null) => {
	return author?.spamTag?.status === 'confirmed-spam';
};

const isAuthorFlagged = (author: { id?: string } | null, flaggedUserIds?: Set<string>) => {
	if (!flaggedUserIds || !author?.id) return false;
	return flaggedUserIds.has(author.id);
};

const isHidden = (
	author: { id?: string; spamTag?: { status?: string } } | null,
	flaggedUserIds?: Set<string>,
) => isAuthorSpam(author) || isAuthorFlagged(author, flaggedUserIds);

type SanitizeOptions = {
	flaggedUserIds?: Set<string>;
};

export default (
	discussions: any[],
	activePermissions: any,
	loginId: string | null,
	options?: SanitizeOptions,
) => {
	const { canAdmin } = activePermissions;
	const { flaggedUserIds } = options ?? {};
	const afterVisibility = sanitizeOnVisibility(discussions, activePermissions, loginId);

	return afterVisibility
		.filter((discussion) => {
			if (!isHidden(discussion.author, flaggedUserIds)) {
				return true;
			}
			return canAdmin;
		})
		.map((discussion) => {
			const hidden = isHidden(discussion.author, flaggedUserIds);
			const comments = (discussion.thread?.comments ?? [])
				.filter((comment) => {
					if (!isHidden(comment.author, flaggedUserIds)) {
						return true;
					}
					return canAdmin;
				})
				.map((comment) => {
					if (!isHidden(comment.author, flaggedUserIds)) {
						return comment;
					}
					return { ...comment, isAuthorSpam: true };
				});

			return {
				...discussion,
				...(hidden && { isAuthorSpam: true }),
				thread: {
					...discussion.thread,
					comments,
				},
			};
		});
};
