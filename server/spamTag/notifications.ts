import type { ModerationReportReason, SpamStatus, UserSpamTagFields } from 'types';

import {
	sendBanDevEmail,
	sendCommunityFlagDevEmail,
	sendCommunityFlagResolvedEmail,
	sendLiftDevEmail,
	sendNewSpamTagDevEmail,
	sendSpamBanEmail,
	sendSpamLiftedEmail,
} from 'server/utils/email';
import {
	postToSlackAboutCommunityFlag,
	postToSlackAboutNewUserSpamTag,
	postToSlackAboutSuspiciousUpload,
	postToSlackAboutUserBan,
	postToSlackAboutUserLifted,
} from 'server/utils/slack';

export type SpamEvent =
	| 'new-spam-tag'
	| 'suspicious-upload'
	| 'honeypot-ban'
	| 'manual-ban'
	| 'spam-lifted'
	| 'community-flag'
	| 'community-flag-retracted'
	| 'community-flag-resolved';

type SharedContext = {
	userId: string;
	userEmail: string;
	userName: string;
	userSlug: string;
	userAvatar?: string | null;
};

type NewSpamTagContext = SharedContext & {
	spamScore?: number | null;
	spamFields?: UserSpamTagFields;
};

type SuspiciousUploadContext = SharedContext & {
	uploadKey: string;
};

type HoneypotBanContext = SharedContext & {};

type ManualBanContext = SharedContext & {
	spamFields?: UserSpamTagFields;
	previousStatus?: SpamStatus | null;
	actorName?: string;
};

type SpamLiftedContext = SharedContext & {
	previousStatus?: SpamStatus | null;
	actorName?: string;
};

type CommunityFlagContext = SharedContext & {
	communityId: string;
	sourceDiscussionId?: string | null;
	flaggedById: string;
	flagReason: ModerationReportReason;
	flagReasonText?: string | null;
};

type CommunityFlagRetractedContext = SharedContext & {
	communityId: string;
	flaggedById: string;
};

type CommunityFlagResolvedContext = SharedContext & {
	communityId: string;
	flaggedByEmail?: string;
	flaggedByName?: string;
	resolution?: string;
};

export type SpamNotificationContext = {
	userId: string;
	userEmail: string;
	userName: string;
	userSlug: string;
	userAvatar?: string | null;
	spamScore?: number | null;
	spamFields?: UserSpamTagFields;
	previousStatus?: SpamStatus | null;
	actorName?: string;
	uploadKey?: string;
	communityId?: string;
	sourceDiscussionId?: string | null;
	flaggedById?: string;
	flagReason?: ModerationReportReason;
	flagReasonText?: string | null;
	flaggedByEmail?: string;
	flaggedByName?: string;
	resolution?: string;
};

type Handler<T extends SharedContext> = (ctx: T) => Promise<void>;

type Contexts = {
	'new-spam-tag': NewSpamTagContext;
	'suspicious-upload': SuspiciousUploadContext;
	'honeypot-ban': HoneypotBanContext;
	'manual-ban': ManualBanContext;
	'spam-lifted': SpamLiftedContext;
	'community-flag': CommunityFlagContext;
	'community-flag-retracted': CommunityFlagRetractedContext;
	'community-flag-resolved': CommunityFlagResolvedContext;
};

const handlers = {
	'new-spam-tag': [
		(ctx) =>
			postToSlackAboutNewUserSpamTag({
				userId: ctx.userId,
				userName: ctx.userName,
				userSlug: ctx.userSlug,
				spamScore: ctx.spamScore ?? null,
			}),
		(ctx) => sendNewSpamTagDevEmail({ userEmail: ctx.userEmail, userName: ctx.userName }),
	],
	'suspicious-upload': [
		(ctx) =>
			postToSlackAboutSuspiciousUpload(
				ctx.userId,
				ctx.userEmail,
				ctx.userName,
				ctx.uploadKey,
			),
	],
	'honeypot-ban': [(ctx) => sendSpamBanEmail({ toEmail: ctx.userEmail, userName: ctx.userName })],
	'manual-ban': [
		(ctx) =>
			postToSlackAboutUserBan({
				userId: ctx.userId,
				userName: ctx.userName,
				userSlug: ctx.userSlug,
				userAvatar: ctx.userAvatar,
				reason: ctx.spamFields,
				actorName: ctx.actorName,
			}),
		(ctx) => sendSpamBanEmail({ toEmail: ctx.userEmail, userName: ctx.userName }),
		(ctx) => sendBanDevEmail({ userEmail: ctx.userEmail, userName: ctx.userName }),
	],
	'spam-lifted': [
		async (ctx) => {
			if (!ctx.previousStatus || ctx.previousStatus === 'unreviewed') {
				console.log(
					'spam-lifted: not notifying manual marking of unreviewed user as not-spam',
				);
				return;
			}
			return Promise.all([
				postToSlackAboutUserLifted({
					userId: ctx.userId,
					userName: ctx.userName,
					userSlug: ctx.userSlug,
					actorName: ctx.actorName,
				}),
				sendSpamLiftedEmail({ toEmail: ctx.userEmail, userName: ctx.userName }),
				sendLiftDevEmail({ userEmail: ctx.userEmail, userName: ctx.userName }),
			]);
		},
	],
	'community-flag': [
		(ctx) =>
			postToSlackAboutCommunityFlag({
				userId: ctx.userId,
				communityId: ctx.communityId,
				flaggedById: ctx.flaggedById,
				reason: ctx.flagReason,
				reasonText: ctx.flagReasonText,
				sourceDiscussionId: ctx.sourceDiscussionId,
			}),
		(ctx) =>
			sendCommunityFlagDevEmail({
				userEmail: ctx.userEmail,
				userName: ctx.userName,
				communityId: ctx.communityId,
				flagReason: ctx.flagReason,
			}),
	],
	'community-flag-retracted': [
		(ctx) =>
			postToSlackAboutCommunityFlag({
				userId: ctx.userId,
				communityId: ctx.communityId,
				flaggedById: ctx.flaggedById,
				reason: 'other',
				reasonText: 'Flag retracted by community admin',
			}),
	],
	'community-flag-resolved': [
		async (ctx) => {
			if (!ctx.flaggedByEmail) return;
			await sendCommunityFlagResolvedEmail({
				toEmail: ctx.flaggedByEmail,
				flaggedByName: ctx.flaggedByName ?? '',
				userName: ctx.userName,
				resolution: ctx.resolution ?? 'reviewed',
			});
		},
	],
} satisfies { [K in keyof Contexts]: Handler<Contexts[K]>[] };

export const notify = async (event: SpamEvent, ctx: SpamNotificationContext): Promise<void> => {
	const results = await Promise.allSettled(handlers[event].map((h) => h(ctx)));
	for (const result of results) {
		if (result.status === 'rejected') {
			console.error(`notification failed for ${event}:`, result.reason);
		}
	}
};

export const contextFromUser = (
	user: {
		id: string;
		email?: string | null;
		fullName?: string | null;
		slug: string;
		avatar?: string | null;
	},
	extra?: Partial<SpamNotificationContext>,
): SpamNotificationContext => ({
	userId: user.id,
	userEmail: user.email ?? '',
	userName: user.fullName ?? '',
	userSlug: user.slug ?? '',
	userAvatar: user.avatar,
	...extra,
});
