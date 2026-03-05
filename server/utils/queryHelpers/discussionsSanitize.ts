import type { DefinitelyHas, Discussion } from 'types';

import { sanitizeOnVisibility } from './util';

type AuthorWithModeration =
	| {
			spamTag?: { status?: string } | null;
			communityModerationReports?: { status?: string }[];
	  }
	| null
	| undefined;

const isAuthorSpam = (author: AuthorWithModeration) => author?.spamTag?.status === 'confirmed-spam';

const isAuthorCleared = (author: AuthorWithModeration) =>
	author?.spamTag?.status === 'confirmed-not-spam';

const isAuthorFlagged = (author: AuthorWithModeration) =>
	(author?.communityModerationReports?.length ?? 0) > 0;

// cleared users should remain visible even if they have active community reports
const isHidden = (author: AuthorWithModeration) =>
	isAuthorSpam(author) || (isAuthorFlagged(author) && !isAuthorCleared(author));

export default (
	discussions: DefinitelyHas<Discussion, 'visibility'>[],
	activePermissions: any,
	loginId: string | null,
) => {
	const { canAdmin } = activePermissions;
	const afterVisibility = sanitizeOnVisibility(discussions, activePermissions, loginId);

	return afterVisibility
		.filter((discussion) => !isHidden(discussion.author) || canAdmin)
		.map((discussion) => ({
			...discussion,
			thread: {
				...discussion.thread,
				comments: (discussion.thread?.comments ?? []).filter(
					(comment) => !isHidden(comment.author) || canAdmin,
				),
			},
		}));
};
