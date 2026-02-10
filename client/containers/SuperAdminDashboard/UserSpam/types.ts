import type { SpamTag } from 'types';
import type { UserWithPrivateFields } from 'types';

export type SpamUser = UserWithPrivateFields & {
	spamTag: SpamTag | null;
	affiliation?: { communitySubdomains: string[]; pubCount: number; discussionCount: number };
};
