import { wrap } from 'server/wrap';
import { Router } from 'express';
import { sendServicesInquiryEmail } from 'server/utils/email/communityServices';

export const router = Router();

router.post(
	'/api/communityServices',
	wrap(async (req, res) => {
		sendServicesInquiryEmail(req.body);
		return res.status(201).json({ ok: true });
	}),
);
