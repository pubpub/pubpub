import { Router } from 'express';

import { Community, HubCommunity, HubOptOut, Member, Pub, User } from 'server/models';
import { OrgFeaturedPub } from 'server/orgFeaturedPub/model';
import { addPubToOrg, getOrgFeaturedPubs, removePubFromOrg } from 'server/orgFeaturedPub/queries';
import { ForbiddenError, NotFoundError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';

import { fetchBrandAssets } from './brandHelper';
import { getOrgDataDashboard } from './dataQueries';
import {
	addCommunityToOrg,
	addOrgMember,
	createOrg,
	destroyOrg,
	getAllOrgsWithCommunityCounts,
	getHubCommunities,
	getOrgById,
	getOrgBySlug,
	getOrgMembers,
	getOrgsForCommunity,
	isUserOrgMember,
	removeCommunityFromOrg,
	removeOrgMember,
	updateOrg,
} from './queries';
import { getSuggestedCommunities } from './suggestedCommunities';
import { getSuggestedPubs } from './suggestedPubs';

export const router = Router();

/** Require superadmin for all org admin routes */
const requireSuperAdmin = async (req) => {
	const initialData = await getInitialData(req);
	if (!initialData.loginData.isSuperAdmin) {
		throw new ForbiddenError();
	}
	return initialData;
};

/** Require superadmin OR org manager for dashboard-level routes */
const requireSuperAdminOrOrgManager = async (req, orgId: string) => {
	const initialData = await getInitialData(req);
	if (initialData.loginData.isSuperAdmin) {
		return initialData;
	}
	if (initialData.loginData.id) {
		const isMgr = await isUserOrgMember(initialData.loginData.id, orgId);
		if (isMgr) {
			return initialData;
		}
	}
	throw new ForbiddenError();
};

// GET /api/orgs - list all orgs (superadmin)
router.get('/api/orgs', async (req, res, next) => {
	try {
		await requireSuperAdmin(req);
		const orgs = await getAllOrgsWithCommunityCounts();
		return res.status(200).json(orgs);
	} catch (err) {
		return next(err);
	}
});

// POST /api/orgs - create org (superadmin)
router.post('/api/orgs', async (req, res, next) => {
	try {
		await requireSuperAdmin(req);
		const {
			slug,
			title,
			subtitle,
			description,
			avatar,
			heroImage,
			heroLogo,
			accentColorLight,
			accentColorDark,
			website,
			email,
			communityCreationEnabled,
			communityCloneAccess,
			isActive,
			isPrivate,
		} = req.body;
		const org = await createOrg({
			slug,
			title,
			subtitle,
			description,
			avatar,
			heroImage,
			heroLogo,
			accentColorLight,
			accentColorDark,
			website,
			email,
			communityCreationEnabled,
			communityCloneAccess,
			isActive,
			isPrivate,
		});
		return res.status(201).json(org);
	} catch (err) {
		return next(err);
	}
});

/* ------------------------------------------------------------------ */
/* Brand Helper — any logged-in user                                   */
/* ------------------------------------------------------------------ */

// GET /api/orgs/brand-helper?domain=mit.edu
router.get('/api/orgs/brand-helper', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		if (!initialData.loginData.isSuperAdmin) {
			// Check if user is a manager of any org
			const userId = initialData.loginData.id;
			if (!userId) throw new ForbiddenError();
			const { OrgMember } = await import('server/orgMember/model');
			const mgr = await OrgMember.findOne({ where: { userId } });
			if (!mgr) throw new ForbiddenError();
		}
		const { domain } = req.query;
		if (!domain || typeof domain !== 'string') {
			return res.status(400).json({ error: 'domain query parameter is required' });
		}
		const result = await fetchBrandAssets(domain.toLowerCase().trim());
		return res.status(200).json(result);
	} catch (err) {
		return next(err);
	}
});

// GET /api/orgs/brand-helper/proxy-image?url=... — proxy remote images to avoid CORS
router.get('/api/orgs/brand-helper/proxy-image', async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		if (!initialData.loginData.isSuperAdmin) {
			const userId = initialData.loginData.id;
			if (!userId) throw new ForbiddenError();
			const { OrgMember } = await import('server/orgMember/model');
			const mgr = await OrgMember.findOne({ where: { userId } });
			if (!mgr) throw new ForbiddenError();
		}
		const { url } = req.query;
		if (!url || typeof url !== 'string') {
			return res.status(400).json({ error: 'url query parameter is required' });
		}
		// Validate the URL is http(s)
		let parsed: URL;
		try {
			parsed = new URL(url);
		} catch {
			return res.status(400).json({ error: 'Invalid URL' });
		}
		if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
			return res.status(400).json({ error: 'Only http/https URLs are allowed' });
		}
		// Block private/internal IPs to prevent SSRF
		const hostname = parsed.hostname;
		if (
			hostname === 'localhost' ||
			hostname === '127.0.0.1' ||
			hostname === '::1' ||
			hostname === '0.0.0.0' ||
			hostname.startsWith('10.') ||
			hostname.startsWith('192.168.') ||
			hostname.startsWith('169.254.') ||
			hostname.endsWith('.internal') ||
			/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
		) {
			return res.status(400).json({ error: 'Internal addresses are not allowed' });
		}
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 10000);
		const upstream = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; PubPub/7.0; +https://pubpub.org)',
			},
			redirect: 'follow',
			signal: controller.signal,
		});
		clearTimeout(timer);
		if (!upstream.ok) {
			return res.status(502).json({ error: `Upstream returned ${upstream.status}` });
		}
		const ct = upstream.headers.get('content-type') || 'application/octet-stream';
		// Only allow image content types
		if (!ct.startsWith('image/') && !ct.includes('svg')) {
			return res.status(400).json({ error: 'URL did not return an image' });
		}
		const buf = Buffer.from(await upstream.arrayBuffer());
		// Cap at 10MB
		if (buf.length > 10 * 1024 * 1024) {
			return res.status(413).json({ error: 'Image too large' });
		}
		res.set('Content-Type', ct);
		res.set('Content-Length', String(buf.length));
		res.set('Cache-Control', 'private, max-age=300');
		return res.send(buf);
	} catch (err) {
		return next(err);
	}
});

// PUT /api/orgs/:id - update org (superadmin or manager)
router.put('/api/orgs/:id', async (req, res, next) => {
	try {
		const initialData = await requireSuperAdminOrOrgManager(req, req.params.id);
		const {
			title,
			subtitle,
			description,
			avatar,
			heroImage,
			heroLogo,
			accentColorLight,
			accentColorDark,
			website,
			email,
			communityCreationEnabled,
			communityCloneAccess,
		} = req.body;
		const values: Record<string, any> = {
			title,
			subtitle,
			description,
			avatar,
			heroImage,
			heroLogo,
			accentColorLight,
			accentColorDark,
			website,
			email,
			communityCreationEnabled,
			communityCloneAccess,
		};
		// Only superadmins can change privileged fields
		if (initialData.loginData.isSuperAdmin) {
			const { isActive, isPrivate, slug, domains, pubSearchTerms } = req.body;
			Object.assign(values, { isActive, isPrivate, slug, domains, pubSearchTerms });
		}
		// Remove undefined keys so we don't null out fields
		Object.keys(values).forEach((k) => {
			if (values[k] === undefined) delete values[k];
		});
		const org = await updateOrg(req.params.id, values);
		if (!org) {
			throw new NotFoundError();
		}
		return res.status(200).json(org.toJSON());
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/orgs/:id - delete org (superadmin)
router.delete('/api/orgs/:id', async (req, res, next) => {
	try {
		await requireSuperAdmin(req);
		await destroyOrg(req.params.id);
		return res.status(200).json({ success: true });
	} catch (err) {
		return next(err);
	}
});

// GET /api/orgs/:id - get org by id (superadmin or manager)
router.get('/api/orgs/:id', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const org = await getOrgById(req.params.id);
		if (!org) {
			throw new NotFoundError();
		}
		return res.status(200).json(org.toJSON());
	} catch (err) {
		return next(err);
	}
});

// GET /api/orgs/:id/communities - list communities in org (superadmin or manager)
router.get('/api/orgs/:id/communities', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const communities = await getHubCommunities(req.params.id);
		return res.status(200).json(communities);
	} catch (err) {
		return next(err);
	}
});

// POST /api/orgs/:id/communities - add community to org (superadmin or manager)
router.post('/api/orgs/:id/communities', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		let { communityId } = req.body;
		const { subdomain } = req.body;
		if (!communityId && subdomain) {
			const community = await Community.findOne({
				where: { subdomain: subdomain.toLowerCase() },
				attributes: ['id'],
			});
			if (!community) {
				return res.status(404).json({ error: `Community "${subdomain}" not found` });
			}
			communityId = community.id;
		}
		if (!communityId) {
			return res.status(400).json({ error: 'communityId or subdomain is required' });
		}
		const record = await addCommunityToOrg(req.params.id, communityId);
		return res.status(201).json(record);
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/orgs/:id/communities/:communityId - remove community from org (superadmin or manager)
router.delete('/api/orgs/:id/communities/:communityId', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		await removeCommunityFromOrg(req.params.id, req.params.communityId);
		return res.status(200).json({ success: true });
	} catch (err) {
		return next(err);
	}
});

// GET /api/orgs/slug/:slug/data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// Fetch org data dashboard with optional time range for analytics
router.get('/api/orgs/slug/:slug/data', async (req, res, next) => {
	try {
		const { slug } = req.params;
		const org = await getOrgBySlug(slug);
		if (!org) throw new NotFoundError();
		const initialData = await requireSuperAdminOrOrgManager(req, org.id);

		// Inactive orgs: only superadmins can access the dashboard
		if (!org.isActive && !initialData.loginData.isSuperAdmin) {
			throw new ForbiddenError();
		}

		const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
		const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;

		const orgData = await getOrgDataDashboard(slug, {
			startDate,
			endDate,
			userId: initialData.loginData.id,
		});
		if (!orgData) throw new NotFoundError();
		return res.status(200).json(orgData);
	} catch (err) {
		return next(err);
	}
});

// PUT /api/orgs/:id/communities/:communityId — update HubCommunity settings
// body: { showOnLandingPage?, dataAccess? }
router.put('/api/orgs/:id/communities/:communityId', async (req, res, next) => {
	try {
		const initialData = await requireSuperAdminOrOrgManager(req, req.params.id);
		const { orgId, communityId } = {
			orgId: req.params.id,
			communityId: req.params.communityId,
		};
		const record = await HubCommunity.findOne({ where: { orgId, communityId } });
		if (!record) {
			throw new NotFoundError();
		}

		const updates: Record<string, any> = {};

		// showOnLandingPage — any org manager can toggle
		if (typeof req.body.showOnLandingPage === 'boolean') {
			updates.showOnLandingPage = req.body.showOnLandingPage;
		}

		// dataAccess — org managers can request; granting requires community admin or superadmin
		if (req.body.dataAccess) {
			const { dataAccess } = req.body;
			if (dataAccess === 'requested' && record.dataAccess === 'none') {
				// Org manager requesting access
				updates.dataAccess = 'requested';
			} else if (dataAccess === 'granted') {
				// Must be superadmin, or both org manager AND community admin
				if (!initialData.loginData.isSuperAdmin) {
					const member = await Member.findOne({
						where: {
							userId: initialData.loginData.id!,
							communityId,
							permissions: 'admin',
						},
					});
					if (!member) {
						return res.status(403).json({
							error: 'Must be a community admin to grant data access',
						});
					}
				}
				updates.dataAccess = 'granted';
			} else if (dataAccess === 'none') {
				// Org manager can withdraw request, or revoke granted access
				updates.dataAccess = 'none';
			}
		}

		if (Object.keys(updates).length > 0) {
			await record.update(updates);
		}
		return res.status(200).json(record.toJSON());
	} catch (err) {
		return next(err);
	}
});

/* ------------------------------------------------------------------ */
/* Org Managers — superadmin or org manager                    */
/* ------------------------------------------------------------------ */

// GET /api/orgs/:id/managers
router.get('/api/orgs/:id/managers', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const managers = await getOrgMembers(req.params.id);
		return res.status(200).json(managers);
	} catch (err) {
		return next(err);
	}
});

// POST /api/orgs/:id/managers — body: { slug } (user slug) or { userId }
router.post('/api/orgs/:id/managers', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		let { userId } = req.body;
		const { slug } = req.body;
		if (!userId && slug) {
			const user = await User.findOne({
				where: { slug: slug.toLowerCase() },
				attributes: ['id'],
			});
			if (!user) {
				return res.status(404).json({ error: `User "${slug}" not found` });
			}
			userId = user.id;
		}
		if (!userId) {
			return res.status(400).json({ error: 'userId or slug is required' });
		}
		const record = await addOrgMember(req.params.id, userId);
		return res.status(201).json(record);
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/orgs/:id/managers/:userId
router.delete('/api/orgs/:id/managers/:userId', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		await removeOrgMember(req.params.id, req.params.userId);
		return res.status(200).json({ success: true });
	} catch (err) {
		return next(err);
	}
});

/* ------------------------------------------------------------------ */
/* Suggested Communities — superadmin or org manager                    */
/* ------------------------------------------------------------------ */

// GET /api/orgs/:id/suggested-communities
router.get('/api/orgs/:id/suggested-communities', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const suggestions = await getSuggestedCommunities(req.params.id);
		return res.status(200).json(suggestions);
	} catch (err) {
		return next(err);
	}
});

/* ------------------------------------------------------------------ */
/* Curated Pubs — superadmin or org manager                            */
/* ------------------------------------------------------------------ */

// GET /api/orgs/:id/pubs — list curated pubs for this org
router.get('/api/orgs/:id/pubs', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const pubs = await getOrgFeaturedPubs(req.params.id);
		return res.status(200).json(pubs);
	} catch (err) {
		return next(err);
	}
});

// POST /api/orgs/:id/pubs — add a pub to the org's curated list
// body: { pubId, rank?, showOnLandingPage? }
router.post('/api/orgs/:id/pubs', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const { pubId, rank, showOnLandingPage } = req.body;
		if (!pubId) {
			return res.status(400).json({ error: 'pubId is required' });
		}
		const pub = await Pub.findByPk(pubId, { attributes: ['id'] });
		if (!pub) {
			return res.status(404).json({ error: 'Pub not found' });
		}
		const record = await addPubToOrg(req.params.id, pubId, { rank, showOnLandingPage });
		return res.status(201).json(record);
	} catch (err) {
		return next(err);
	}
});

// PUT /api/orgs/:id/pubs/:pubId — update OrgFeaturedPub settings (rank, showOnLandingPage, request/grant dataAccess)
router.put('/api/orgs/:id/pubs/:pubId', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const record = await OrgFeaturedPub.findOne({
			where: { orgId: req.params.id, pubId: req.params.pubId },
		});
		if (!record) {
			throw new NotFoundError();
		}
		const updates: Record<string, any> = {};
		if (typeof req.body.showOnLandingPage === 'boolean') {
			updates.showOnLandingPage = req.body.showOnLandingPage;
		}
		if (typeof req.body.rank === 'string') {
			updates.rank = req.body.rank;
		}
		// Org managers can request data access (none → requested)
		if (req.body.dataAccess === 'requested' && record.dataAccess === 'none') {
			updates.dataAccess = 'requested';
		}
		// Superadmins, pub admins/managers, and community admins can directly grant/revoke
		if (req.body.dataAccess === 'granted' || req.body.dataAccess === 'none') {
			const initialData = await getInitialData(req);
			let canGrant = initialData.loginData.isSuperAdmin;
			if (!canGrant && initialData.loginData.id) {
				// Check pub-level manage/admin
				const pubMember = await Member.findOne({
					where: {
						userId: initialData.loginData.id,
						pubId: req.params.pubId,
						permissions: ['manage', 'admin'],
					},
				});
				if (pubMember) {
					canGrant = true;
				} else {
					// Check community-level admin
					const pub = await Pub.findByPk(req.params.pubId, {
						attributes: ['communityId'],
					});
					if (pub) {
						const communityMember = await Member.findOne({
							where: {
								userId: initialData.loginData.id,
								communityId: pub.communityId,
								permissions: 'admin',
							},
						});
						if (communityMember) canGrant = true;
					}
				}
			}
			if (canGrant) {
				updates.dataAccess = req.body.dataAccess;
			}
		}
		if (Object.keys(updates).length > 0) {
			await record.update(updates);
		}
		return res.status(200).json(record.toJSON());
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/orgs/:id/pubs/:pubId — remove a pub from the org's curated list
router.delete('/api/orgs/:id/pubs/:pubId', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		await removePubFromOrg(req.params.id, req.params.pubId);
		return res.status(200).json({ success: true });
	} catch (err) {
		return next(err);
	}
});

// GET /api/orgs/:id/suggested-pubs
router.get('/api/orgs/:id/suggested-pubs', async (req, res, next) => {
	try {
		await requireSuperAdminOrOrgManager(req, req.params.id);
		const limit = Math.min(parseInt(String(req.query.limit), 10) || 50, 200);
		const offset = Math.max(parseInt(String(req.query.offset), 10) || 0, 0);
		const excludeCommunityIds = req.query.excludeCommunityIds
			? String(req.query.excludeCommunityIds).split(',')
			: [];
		const result = await getSuggestedPubs(req.params.id, {
			limit,
			offset,
			excludeCommunityIds,
		});
		return res.status(200).json(result);
	} catch (err) {
		return next(err);
	}
});

/* ------------------------------------------------------------------ */
/* Community curation endpoints                                        */
/* ------------------------------------------------------------------ */

/** Helper: require that the requesting user is a community admin or superadmin */
const requireCommunityAdmin = async (req, communityId: string) => {
	const initialData = await getInitialData(req);
	if (initialData.loginData.isSuperAdmin) {
		return initialData;
	}
	if (!initialData.loginData.id) {
		throw new ForbiddenError();
	}
	const member = await Member.findOne({
		where: {
			userId: initialData.loginData.id,
			communityId,
			permissions: 'admin',
		},
	});
	if (!member) {
		throw new ForbiddenError();
	}
	return initialData;
};

// GET /api/communities/:communityId/curating-orgs — list orgs curating this community
// Includes a `rejected` flag per org if the community has opted out of that org
// Includes `dataAccess` from HubCommunity so community admins can approve/deny requests
router.get('/api/communities/:communityId/curating-orgs', async (req, res, next) => {
	try {
		await requireCommunityAdmin(req, req.params.communityId);
		const orgs = await getOrgsForCommunity(req.params.communityId);
		// Get all opt-outs for this community
		const optOuts = await HubOptOut.findAll({
			where: { communityId: req.params.communityId },
			attributes: ['orgId'],
		});
		const rejectedOrgIds = new Set(optOuts.map((o) => (o as any).orgId));
		// Get data access status for each org
		const hubCommunities = await HubCommunity.findAll({
			where: { communityId: req.params.communityId },
			attributes: ['orgId', 'dataAccess'],
		});
		const dataAccessMap = new Map(
			hubCommunities.map((hc) => [(hc as any).orgId, (hc as any).dataAccess]),
		);
		const orgsWithStatus = orgs.map((org: any) => ({
			...org,
			rejected: rejectedOrgIds.has(org.id),
			dataAccess: dataAccessMap.get(org.id) || 'none',
		}));
		return res.status(200).json(orgsWithStatus);
	} catch (err) {
		return next(err);
	}
});

// POST /api/communities/:communityId/org-opt-out — reject a specific org (community admin)
// body: { orgId }
router.post('/api/communities/:communityId/org-opt-out', async (req, res, next) => {
	try {
		await requireCommunityAdmin(req, req.params.communityId);
		const { orgId } = req.body;
		if (!orgId) {
			return res.status(400).json({ error: 'orgId is required' });
		}
		await HubOptOut.findOrCreate({
			where: { communityId: req.params.communityId, orgId },
		});
		return res.status(200).json({ rejected: true });
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/communities/:communityId/org-opt-out/:orgId — un-reject an org
router.delete('/api/communities/:communityId/org-opt-out/:orgId', async (req, res, next) => {
	try {
		await requireCommunityAdmin(req, req.params.communityId);
		await HubOptOut.destroy({
			where: {
				communityId: req.params.communityId,
				orgId: req.params.orgId,
			},
		});
		return res.status(200).json({ rejected: false });
	} catch (err) {
		return next(err);
	}
});

// PUT /api/communities/:communityId/curating-orgs/:orgId/data-access — grant or deny data access (community admin)
// body: { dataAccess: 'granted' | 'none' }
router.put(
	'/api/communities/:communityId/curating-orgs/:orgId/data-access',
	async (req, res, next) => {
		try {
			await requireCommunityAdmin(req, req.params.communityId);
			const { dataAccess } = req.body;
			if (!dataAccess || !['granted', 'none'].includes(dataAccess)) {
				return res.status(400).json({ error: "dataAccess must be 'granted' or 'none'" });
			}
			const record = await HubCommunity.findOne({
				where: {
					orgId: req.params.orgId,
					communityId: req.params.communityId,
				},
			});
			if (!record) {
				throw new NotFoundError();
			}
			await record.update({ dataAccess });
			return res.status(200).json({ dataAccess: record.dataAccess });
		} catch (err) {
			return next(err);
		}
	},
);

/* ------------------------------------------------------------------ */
/* Pub curation endpoints (pub-scope "Curated By")                     */
/* ------------------------------------------------------------------ */

/** Helper: require that the requesting user is a pub admin/manager or superadmin */
const requirePubManager = async (req, pubId: string) => {
	const initialData = await getInitialData(req);
	if (initialData.loginData.isSuperAdmin) {
		return initialData;
	}
	if (!initialData.loginData.id) {
		throw new ForbiddenError();
	}
	const member = await Member.findOne({
		where: {
			userId: initialData.loginData.id,
			pubId,
			permissions: ['manage', 'admin'],
		},
	});
	if (!member) {
		throw new ForbiddenError();
	}
	return initialData;
};

// GET /api/pubs/:pubId/curating-orgs — list orgs curating this pub
router.get('/api/pubs/:pubId/curating-orgs', async (req, res, next) => {
	try {
		await requirePubManager(req, req.params.pubId);
		const { getOrgsForPub } = await import('server/orgFeaturedPub/queries');
		const orgs = await getOrgsForPub(req.params.pubId);
		return res.status(200).json(orgs);
	} catch (err) {
		return next(err);
	}
});

// DELETE /api/pubs/:pubId/curating-orgs/:orgId — remove this pub from an org (pub manager opt-out)
router.delete('/api/pubs/:pubId/curating-orgs/:orgId', async (req, res, next) => {
	try {
		await requirePubManager(req, req.params.pubId);
		const { removePubFromOrg } = await import('server/orgFeaturedPub/queries');
		await removePubFromOrg(req.params.orgId, req.params.pubId);
		return res.status(200).json({ success: true });
	} catch (err) {
		return next(err);
	}
});

// PUT /api/pubs/:pubId/curating-orgs/:orgId/data-access — grant or revoke data access (pub manager)
// body: { dataAccess: 'granted' | 'none' }
router.put('/api/pubs/:pubId/curating-orgs/:orgId/data-access', async (req, res, next) => {
	try {
		await requirePubManager(req, req.params.pubId);
		const { dataAccess } = req.body;
		if (!dataAccess || !['granted', 'none'].includes(dataAccess)) {
			return res.status(400).json({ error: "dataAccess must be 'granted' or 'none'" });
		}
		const record = await OrgFeaturedPub.findOne({
			where: {
				orgId: req.params.orgId,
				pubId: req.params.pubId,
			},
		});
		if (!record) {
			throw new NotFoundError();
		}
		await record.update({ dataAccess });
		return res.status(200).json({ dataAccess: record.dataAccess });
	} catch (err) {
		return next(err);
	}
});
