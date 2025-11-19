import { wrap } from 'server/wrap';
import { Router } from 'express';
export const router = Router();
import { sendServicesInquiryEmail } from 'server/utils/email/communityServices';

router.post(
	'/api/communityServices',
	wrap(async (req, res) => {
		sendServicesInquiryEmail(req.body);
		return res.status(201).json({ ok: true });
	}),
);
