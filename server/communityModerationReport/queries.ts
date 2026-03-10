import type { ModerationReportReason, ModerationReportStatus } from 'types';

import { Community, CommunityModerationReport, SpamTag, ThreadComment, User } from 'server/models';
import { contextFromUser, notify } from 'server/spamTag/notifications';

type CreateReportOptions = {
	userId: string;
	communityId: string;
	actorId: string;
	reason: ModerationReportReason;
	reasonText?: string | null;
	sourceThreadCommentId?: string | null;
	spamTagId?: string | null;
};

export const createReport = async (options: CreateReportOptions) => {
	const { userId, communityId, actorId, reason, reasonText, sourceThreadCommentId, spamTagId } =
		options;
	const report = await CommunityModerationReport.create({
		userId,
		communityId,
		actorId,
		reason,
		reasonText: reasonText ?? null,
		sourceThreadCommentId: sourceThreadCommentId ?? null,
		spamTagId: spamTagId ?? null,
	});
	return report.toJSON();
};

export const updateReportStatus = async (reportId: string, status: ModerationReportStatus) => {
	const report = await CommunityModerationReport.findByPk(reportId);
	if (!report) return null;
	await report.update({ status });
	return report.toJSON();
};

export const getActiveReportsForUserInCommunity = async (
	userId: string,
	communityId: string,
): Promise<CommunityModerationReport[]> => {
	return CommunityModerationReport.findAll({
		where: { userId, communityId, status: 'active' },
	});
};

export const isUserReportedInCommunity = async (
	userId: string,
	communityId: string,
): Promise<boolean> => {
	const user = await CommunityModerationReport.findOne({
		where: { userId, communityId, status: 'active' },
	});
	return user !== null;
};

export const isUserReportedInCommunityByHostname = async (
	userId: string,
	hostname: string,
): Promise<boolean> => {
	const subdomain = hostname.replace(/\.pubpub\.org$|\.duqduq\.org$/, '');
	const user = await CommunityModerationReport.findOne({
		raw: true,
		where: { userId, status: 'active', '$community.subdomain$': subdomain },
		include: [{ model: Community, as: 'community', where: { subdomain } }],
	});
	return user !== null;
};

export const getReportsForCommunity = async (communityId: string) => {
	return CommunityModerationReport.findAll({
		where: { communityId },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'actor', attributes: ['id', 'fullName', 'slug'] },
			{ model: ThreadComment, as: 'sourceThreadComment', attributes: ['id', 'text'] },
			{ model: SpamTag, as: 'spamTag', attributes: ['id', 'status'] },
		],
	});
};

export const getActiveBannedUsersForCommunity = async (communityId: string) => {
	return CommunityModerationReport.findAll({
		where: { communityId, status: 'active' },
		order: [['createdAt', 'DESC']],
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'fullName', 'slug', 'avatar', 'initials'],
			},
			{ model: User, as: 'actor', attributes: ['id', 'fullName', 'slug'] },
		],
	});
};

export const getAllActiveReports = async () => {
	return CommunityModerationReport.findAll({
		where: { status: 'active' },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'actor', attributes: ['id', 'fullName', 'slug'] },
			{ model: Community, as: 'community', attributes: ['id', 'subdomain'] },
			{ model: ThreadComment, as: 'sourceThreadComment', attributes: ['id', 'text'] },
			{ model: SpamTag, as: 'spamTag', attributes: ['id', 'status'] },
		],
	});
};

export const getReportById = async (reportId: string) => {
	return CommunityModerationReport.findByPk(reportId, {
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'actor', attributes: ['id', 'fullName', 'slug'] },
			{ model: Community, as: 'community', attributes: ['id', 'subdomain'] },
			{ model: SpamTag, as: 'spamTag', attributes: ['id', 'status'] },
		],
	});
};

export const getActiveReportCountForUser = async (userId: string): Promise<number> => {
	return CommunityModerationReport.count({
		where: { userId, status: 'active' },
	});
};

export const getReportByIdAndActor = async (
	reportId: string,
	actorId: string,
): Promise<CommunityModerationReport | null> => {
	return CommunityModerationReport.findOne({
		where: { id: reportId, actorId },
	});
};

export const getActiveReportIdsForUserInCommunity = async (
	userId: string,
	communityId: string,
): Promise<string[]> => {
	const reports = await CommunityModerationReport.findAll({
		where: { userId, communityId, status: 'active' },
		attributes: ['id'],
	});
	return reports.map((r) => r.id);
};

export const notifyReportersOfCommunityFlagResolution = async (
	userId: string,
	reportedUser: {
		id: string;
		email?: string | null;
		fullName?: string | null;
		slug: string;
		avatar?: string | null;
	},
	resolution: string,
) => {
	const reports = await CommunityModerationReport.findAll({
		where: { userId, status: 'active' },
		attributes: ['actorId', 'communityId'],
	});
	if (reports.length === 0) return;

	const actorIds = [...new Set(reports.map((r) => r.actorId))];
	const actors = await User.findAll({
		where: { id: actorIds },
		attributes: ['id', 'email', 'fullName', 'slug'],
	});
	const actorMap = new Map(actors.map((u) => [u.id, u]));

	await Promise.all(
		reports.map((report) => {
			const actor = actorMap.get(report.actorId);
			if (!actor?.email) return Promise.resolve();
			return notify(
				'community-flag-resolved',
				contextFromUser(reportedUser, {
					communityId: report.communityId,
					actorFullName: actor.fullName ?? '',
					actorSlug: actor.slug ?? '',
					actorEmail: actor.email,
					resolution,
				}),
			);
		}),
	);
};
