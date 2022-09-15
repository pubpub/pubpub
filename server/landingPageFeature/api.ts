import app, { wrap } from 'server/server';
import { ForbiddenError } from 'server/utils/errors';

import { canModifyLandingPageFeatures } from './permissions';
import {
	createLandingPageFeature,
	destroyLandingPageFeature,
	updateLandingPageFeature,
} from './queries';

app.post(
	'/api/landingPageFeature',
	wrap(async (req, res) => {
		const {
			landingPageFeature: { pubId, communityId, rank },
		} = req.body;
		const canCreate = await canModifyLandingPageFeatures({ userId: req.user?.id });
		if (!canCreate) {
			throw new ForbiddenError();
		}
		const newFeature = await createLandingPageFeature({ pubId, communityId, rank });
		return res.status(201).send(newFeature);
	}),
);

app.put(
	'/api/landingPageFeature',
	wrap(async (req, res) => {
		const {
			landingPageFeature: { id, rank },
		} = req.body;
		const canUpdate = await canModifyLandingPageFeatures({ userId: req.user?.id });
		if (!canUpdate) {
			throw new ForbiddenError();
		}
		await updateLandingPageFeature({ id, rank });
		return res.status(200).send({});
	}),
);

app.delete(
	'/api/landingPageFeature',
	wrap(async (req, res) => {
		const {
			landingPageFeature: { id },
		} = req.body;
		const canDestroy = await canModifyLandingPageFeatures({ userId: req.user?.id });
		if (!canDestroy) {
			throw new ForbiddenError();
		}
		await destroyLandingPageFeature({ id });
		return res.status(200).send({});
	}),
);
