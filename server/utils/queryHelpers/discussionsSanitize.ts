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

type ReportedUserMapEntry = { reportIds: string[] };

type SanitizeOptions = {
	flaggedUserIds?: Set<string>;
	reportedUserMap?: Map<string, ReportedUserMapEntry>;
};

const getReportIds = (
	authorId: string | undefined,
	reportedUserMap?: Map<string, ReportedUserMapEntry>,
): string[] | undefined => {
	if (!reportedUserMap || !authorId) return undefined;
	return reportedUserMap.get(authorId)?.reportIds;
};

export default (
	discussions: any[],
	activePermissions: any,
	loginId: string | null,
	options?: SanitizeOptions,
) => {
	const { canAdmin } = activePermissions;
	const { flaggedUserIds, reportedUserMap } = options ?? {};
	const afterVisibility = sanitizeOnVisibility(discussions, activePermissions, loginId);

	return afterVisibility
		.filter((discussion) => {
			if (!isHidden(discussion.author, flaggedUserIds)) return true;
			return canAdmin;
		})
		.map((discussion) => {
			const spam = isAuthorSpam(discussion.author);
			const flagged = isAuthorFlagged(discussion.author, flaggedUserIds);
			const reportIds = flagged
				? getReportIds(discussion.author?.id, reportedUserMap)
				: undefined;

			const comments = (discussion.thread?.comments ?? [])
				.filter((comment) => {
					if (!isHidden(comment.author, flaggedUserIds)) return true;
					return canAdmin;
				})
				.map((comment) => {
					const commentSpam = isAuthorSpam(comment.author);
					const commentFlagged = isAuthorFlagged(comment.author, flaggedUserIds);
					if (!commentSpam && !commentFlagged) return comment;
					const commentReportIds = commentFlagged
						? getReportIds(comment.author?.id, reportedUserMap)
						: undefined;
					return {
						...comment,
						...(commentSpam && { isAuthorSpam: true }),
						...(commentFlagged && !commentSpam && { isAuthorFlagged: true }),
						...(commentReportIds && { moderationReportIds: commentReportIds }),
					};
				});

			return {
				...discussion,
				...(spam && { isAuthorSpam: true }),
				...(flagged && !spam && { isAuthorFlagged: true }),
				...(reportIds && { moderationReportIds: reportIds }),
				thread: {
					...discussion.thread,
					comments,
				},
			};
		});
};
