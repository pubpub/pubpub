/** This should all be moved to an AWS lambda */

import { initServer } from '@ts-rest/express';
import { Request } from 'express';

import { contract } from 'utils/api/contract';

const s = initServer();

/**
 * We just use the user agent and ip address to create a unique identifier for the user.
 *
 * We cannot use the session cookie or the userId that follows from this, this would require a
 * cookie banner (TODO: check this)
 */
const fingerPrint = (req: Request) => {
	const {
		headers: { 'user-agent': userAgent, 'x-forwarded-for': forwardedFor },
	} = req;

	/** TODO: Hash this in some way + add fallback for forwardedFor */
	return `${forwardedFor}-${userAgent}`;
};

const sendToStitch = async (payload: any) => {
	if (!process.env.STITCH_WEBHOOK_URL) {
		throw new Error('Missing STITCH_WEBHOOK_URL');
	}

	const response = await fetch(process.env.STITCH_WEBHOOK_URL, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return response;
};

export const analyticsServer = s.router(contract.analytics, {
	page: async ({ body: payload, req }) => {
		const userFingerPrint = fingerPrint(req);

		await sendToStitch({
			...payload,
			fingerprint: userFingerPrint,
		});

		return {
			status: 204,
			body: undefined,
		};
	},
	track: async ({ body: payload, req }) => {
		const userFingerPrint = fingerPrint(req);

		await sendToStitch({
			...payload,
			fingerprint: userFingerPrint,
		});

		return {
			status: 204,
			body: undefined,
		};
	},
});
