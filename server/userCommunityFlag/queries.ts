import type { UserCommunityFlagReason, UserCommunityFlagStatus } from 'types';

import { Community, Discussion, User, UserCommunityFlag } from 'server/models';

type CreateFlagOptions = {
	userId: string;
	communityId: string;
	flaggedById: string;
	reason: UserCommunityFlagReason;
	reasonText?: string | null;
	sourceDiscussionId?: string | null;
};

export const createFlag = async (options: CreateFlagOptions) => {
	const { userId, communityId, flaggedById, reason, reasonText, sourceDiscussionId } = options;
	const flag = await UserCommunityFlag.create({
		userId,
		communityId,
		flaggedById,
		reason,
		reasonText: reasonText ?? null,
		sourceDiscussionId: sourceDiscussionId ?? null,
	});
	return flag.toJSON();
};

export const updateFlagStatus = async (flagId: string, status: UserCommunityFlagStatus) => {
	const flag = await UserCommunityFlag.findByPk(flagId);
	if (!flag) return null;
	await flag.update({ status });
	return flag.toJSON();
};

export const getActiveFlagsForUserInCommunity = async (
	userId: string,
	communityId: string,
): Promise<UserCommunityFlag[]> => {
	return UserCommunityFlag.findAll({
		where: { userId, communityId, status: 'active' },
	});
};

export const getFlaggedUserIdsForCommunity = async (communityId: string): Promise<Set<string>> => {
	const flags = await UserCommunityFlag.findAll({
		where: { communityId, status: 'active' },
		attributes: ['userId'],
	});
	return new Set(flags.map((f) => f.userId));
};

export const isUserFlaggedInCommunity = async (
	userId: string,
	communityId: string,
): Promise<boolean> => {
	const count = await UserCommunityFlag.count({
		where: { userId, communityId, status: 'active' },
	});
	return count > 0;
};

export const getFlagsForCommunity = async (communityId: string) => {
	return UserCommunityFlag.findAll({
		where: { communityId },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
			{ model: Discussion, as: 'sourceDiscussion', attributes: ['id', 'title'] },
		],
	});
};

export const getAllActiveFlags = async () => {
	return UserCommunityFlag.findAll({
		where: { status: 'active' },
		order: [['createdAt', 'DESC']],
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
			{ model: Community, as: 'community', attributes: ['id', 'subdomain'] },
			{ model: Discussion, as: 'sourceDiscussion', attributes: ['id', 'title'] },
		],
	});
};

export const getFlagById = async (flagId: string) => {
	return UserCommunityFlag.findByPk(flagId, {
		include: [
			{ model: User, as: 'user', attributes: ['id', 'fullName', 'slug', 'email'] },
			{ model: User, as: 'flaggedBy', attributes: ['id', 'fullName', 'slug'] },
			{ model: Community, as: 'community', attributes: ['id', 'subdomain'] },
		],
	});
};

export const getActiveFlagCountForUser = async (userId: string): Promise<number> => {
	return UserCommunityFlag.count({
		where: { userId, status: 'active' },
	});
};

type FlagCheckResult = {
	isFlagged: boolean;
	flags: Array<{ communityId: string; reason: UserCommunityFlagReason }>;
};

export const getActiveFlagsForUser = async (userId: string): Promise<FlagCheckResult> => {
	const flags = await UserCommunityFlag.findAll({
		where: { userId, status: 'active' },
		attributes: ['communityId', 'reason'],
	});
	return {
		isFlagged: flags.length > 0,
		flags: flags.map((f) => ({
			communityId: f.communityId,
			reason: f.reason,
		})),
	};
};
