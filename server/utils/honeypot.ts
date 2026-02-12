import type { HoneypotTrigger } from 'types';

import { addSpamTagToUser, updateSpamTagForUser } from 'server/spamTag/userQueries';

export const isHoneypotFilled = (value: unknown): boolean => {
	if (value == null) return false;
	if (typeof value === 'string') return value.trim().length > 0;
	return true;
};

export const handleHoneypotTriggered = async (
	userId: string | null,
	honeypot: HoneypotTrigger,
	value: string,
): Promise<void> => {
	if (!userId) return;
	await addSpamTagToUser(userId, { honeypotTriggers: [{ honeypot, value }] });
	await updateSpamTagForUser({ userId, status: 'confirmed-spam' });
};
