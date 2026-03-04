import type { ModerationReportReason, ModerationReportStatus } from 'types';

import { Community, CommunityModerationReport, Discussion, SpamTag, User } from 'server/models';

type CreateReportOptions = {
	userId: string;
	communityId: string;
	flaggedById: string;
	reason: ModerationReportReason;
	reasonText?: string | null;
	sourceDiscussionId?: string | null;
	spamTagId?: string | null;
};

export const createReport = async (options: CreateReportOptions) => {
	const { userId, communityId, flaggedById, reason, reasonText, sourceDiscussionId, spamTagId } =
		options;
	const report = await CommunityModerationReport.create({
		userId,
		communityId,
		flaggedById,
		reason,
		reasonText: reasonText ?? null,
		sourceDiscussionId: sourceDiscussionId ?? null,
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

export const getReportedUserIdsForCommunity = async (communityId: string): Promise<Set<string>> => {
	const reports = await CommunityModerationReport.findAll({
		where: { communityId, status: 'active' },
		attributes: ['userId'],
	});
	return new Set(reports.map((r) => r.userId));
};

export const isUserReportedInCommunity = async (
	userId: string,
	communityId: string,
): Promise<boolean> => {
	const count = await CommunityModerationReport.count({
		where: { userId, communityId, status: 'active' },
	});
	return count > 0;
};

export const getReportsForCommunity = async (communityId: string) => {
	return CommunityModerationReport.findAll({
		where: { communityId },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
			{ model: Discussion, as: 'sourceDiscussion', attributes: ['id', 'title'] },
			{ model: SpamTag, as: 'spamTag', attributes: ['id', 'status'] },
		],
	});
};

export const getAllActiveReports = async () => {
	return CommunityModerationReport.findAll({
		where: { status: 'active' },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
			{ model: Community, as: 'community', attributes: ['id', 'subdomain'] },
			{ model: Discussion, as: 'sourceDiscussion', attributes: ['id', 'title'] },
			{ model: SpamTag, as: 'spamTag', attributes: ['id', 'status'] },
		],
	});
};

export const getReportById = async (reportId: string) => {
	return CommunityModerationReport.findByPk(reportId, {
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
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

export const getActiveReportsByFlaggedBy = async (
	reportId: string,
	flaggedById: string,
): Promise<CommunityModerationReport | null> => {
	return CommunityModerationReport.findOne({
		where: { id: reportId, flaggedById },
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

type ReportedUserMapEntry = {
	reportIds: string[];
};

export const getReportedUserMapForCommunity = async (
	communityId: string,
): Promise<Map<string, ReportedUserMapEntry>> => {
	const reports = await CommunityModerationReport.findAll({
		where: { communityId, status: 'active' },
		attributes: ['id', 'userId'],
	});
	const map = new Map<string, ReportedUserMapEntry>();
	for (const r of reports) {
		const existing = map.get(r.userId);
		if (existing) {
			existing.reportIds.push(r.id);
		} else {
			map.set(r.userId, { reportIds: [r.id] });
		}
	}
	return map;
};
