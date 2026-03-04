import { Router } from 'express';

import { notify } from 'server/spamTag/notifications';
import { canManipulateSpamTags } from 'server/spamTag/permissions';
import { upsertSpamTag } from 'server/spamTag/userQueries';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';
import { getScope } from 'server/utils/queryHelpers';
import { wrap } from 'server/wrap';

import {
	createReport,
	getActiveReportsByFlaggedBy,
	getAllActiveReports,
	getReportById,
	getReportsForCommunity,
	updateReportStatus,
} from './queries';

export const router = Router();

router.post(
	'/api/communityModerationReports',
	wrap(async (req, res) => {
		const { userId, communityId, reason, reasonText, sourceDiscussionId } = req.body;
		const flaggedById = req.user?.id;
		if (!flaggedById || !userId || !communityId || !reason) {
			return res.status(400).send({ error: 'Missing required fields' });
		}

		const scopeData = await getScope({ communityId, loginId: flaggedById });
		if (!scopeData.activePermissions.canAdmin) {
			throw new ForbiddenError();
		}

		const { spamTag } = await upsertSpamTag({ userId });

		const report = await createReport({
			userId,
			communityId,
			flaggedById,
			reason,
			reasonText,
			sourceDiscussionId,
			spamTagId: spamTag.id,
		});

		notify('community-flag', {
			userId,
			userEmail: '',
			userName: '',
			userSlug: '',
			communityId,
			flaggedById,
			flagReason: reason,
			flagReasonText: reasonText,
			sourceDiscussionId,
		}).catch((err) => console.error('Failed to send community flag notification', err));

		return res.status(201).json(report);
	}),
);

router.put(
	'/api/communityModerationReports/:id',
	wrap(async (req, res) => {
		const { status } = req.body;
		const reportId = req.params.id;
		const userId = req.user?.id;
		if (!userId) throw new ForbiddenError();

		if (status === 'retracted') {
			const ownReport = await getActiveReportsByFlaggedBy(reportId, userId);
			if (!ownReport) {
				const existing = await getReportById(reportId);
				if (!existing) throw new NotFoundError();
				const scopeData = await getScope({
					communityId: existing.communityId,
					loginId: userId,
				});
				if (!scopeData.activePermissions.canAdmin) {
					throw new ForbiddenError();
				}
			}
			const updated = await updateReportStatus(reportId, 'retracted');
			if (!updated) throw new NotFoundError();

			const retractedReport = await getReportById(reportId);
			if (retractedReport) {
				notify('community-flag-retracted', {
					userId: retractedReport.userId,
					userEmail: '',
					userName: retractedReport.user?.fullName ?? '',
					userSlug: retractedReport.user?.slug ?? '',
					communityId: retractedReport.communityId,
					flaggedById: userId,
				}).catch((err) =>
					console.error('Failed to send flag retraction notification', err),
				);
			}

			return res.status(200).json(updated);
		}

		const isSuperAdmin = await canManipulateSpamTags({ userId });
		if (!isSuperAdmin) {
			throw new ForbiddenError();
		}
		const updated = await updateReportStatus(reportId, status);
		if (!updated) throw new NotFoundError();
		return res.status(200).json(updated);
	}),
);

router.get(
	'/api/communityModerationReports',
	wrap(async (req, res) => {
		const communityId = req.query.communityId as string | undefined;
		const userId = req.user?.id;
		if (!userId) throw new ForbiddenError();

		if (communityId) {
			const scopeData = await getScope({ communityId, loginId: userId });
			if (!scopeData.activePermissions.canAdmin) {
				throw new ForbiddenError();
			}
			const reports = await getReportsForCommunity(communityId);
			return res.status(200).json(reports);
		}

		const isSuperAdmin = await canManipulateSpamTags({ userId });
		if (!isSuperAdmin) throw new ForbiddenError();
		const reports = await getAllActiveReports();
		return res.status(200).json(reports);
	}),
);
