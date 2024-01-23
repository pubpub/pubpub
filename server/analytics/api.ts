import { initServer } from '@ts-rest/express';
import { Request } from 'express';

import { contract } from 'utils/api/contract';

const s = initServer();

const fingerPrint = (req: Request) => {
	const {
		headers: { 'user-agent': userAgent, 'x-forwarded-for': forwardedFor },
	} = req;
	const { id: userId } = req.user || {};

	if (userId) {
		return userId;
	}

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
