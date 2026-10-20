import {
	Community,
	HubCommunity,
	HubOptOut,
	Org,
	OrgMember,
	Pub,
	Release,
	SpamTag,
	User,
} from 'server/models';

export const getOrgBySlug = async (slug: string) => {
	return Org.findOne({ where: { slug } });
};

export const getOrgById = async (id: string) => {
	return Org.findByPk(id);
};

export const getOrgWithCommunities = async (slug: string) => {
	const org = await Org.findOne({ where: { slug } });
	if (!org) {
		return null;
	}
	const associations = await HubCommunity.findAll({
		where: { orgId: org.id, showOnLandingPage: true },
		include: [
			{
				model: Community,
				attributes: [
					'id',
					'subdomain',
					'domain',
					'title',
					'description',
					'heroBackgroundImage',
					'heroLogo',
					'accentColorLight',
					'accentColorDark',
					'headerLogo',
					'headerColorType',
					'createdAt',
					'updatedAt',
				],
				include: [
					{
						model: SpamTag,
						as: 'spamTag',
						attributes: ['status'],
						required: false,
					},
				],
			},
		],
	});

	// Get per-org opt-outs for this org
	const optOuts = await HubOptOut.findAll({
		where: { orgId: org.id },
		attributes: ['communityId'],
	});
	const rejectedCommunityIds = new Set(optOuts.map((o) => (o as any).communityId));

	const communities = associations
		.map((a) => (a as any).community)
		.filter(Boolean)
		.filter((c: any) => !rejectedCommunityIds.has(c.id) && c.spamTag?.status !== 'confirmed')
		.map((c: any) => c.toJSON());

	// Add pub counts (released pubs only)
	const communitiesWithCounts = await Promise.all(
		communities.map(async (c: any) => {
			const pubCount = await Pub.count({
				where: { communityId: c.id },
				include: [{ model: Release, attributes: [], required: true }],
			});
			return { ...c, pubCount };
		}),
	);

	return {
		...org.toJSON(),
		communities: communitiesWithCounts,
	};
};

export const getAllOrgs = async () => {
	const orgs = await Org.findAll({ order: [['title', 'ASC']] });
	return orgs.map((o) => o.toJSON());
};

export const getAllOrgsWithCommunityCounts = async () => {
	const orgs = await Org.findAll({ order: [['title', 'ASC']] });
	const result = await Promise.all(
		orgs.map(async (org) => {
			const communityCount = await HubCommunity.count({
				where: { orgId: org.id },
			});
			return { ...org.toJSON(), communityCount };
		}),
	);
	return result;
};

/** Fetches all orgs with community counts + total pub counts for the /orgs directory.
 *  Filters out private orgs. Inactive orgs still appear (inactive only hides the dashboard). */
export const getAllOrgsForDirectory = async () => {
	const orgs = await Org.findAll({
		where: { isPrivate: false },
		order: [['title', 'ASC']],
	});
	const result = await Promise.all(
		orgs.map(async (org) => {
			const associations = await HubCommunity.findAll({
				where: { orgId: org.id },
				include: [
					{
						model: Community,
						attributes: ['id'],
						include: [
							{
								model: SpamTag,
								as: 'spamTag',
								attributes: ['status'],
								required: false,
							},
						],
					},
				],
			});
			const communityIds = associations
				.map((a) => (a as any).community)
				.filter((c: any) => c && c.spamTag?.status !== 'confirmed')
				.map((c: any) => c.id);
			const communityCount = communityIds.length;
			const pubCount =
				communityCount > 0
					? await Pub.count({
							where: { communityId: communityIds },
							include: [{ model: Release, attributes: [], required: true }],
						})
					: 0;
			return { ...org.toJSON(), communityCount, pubCount };
		}),
	);
	return result;
};

export const createOrg = async (values: {
	slug: string;
	title: string;
	subtitle?: string | null;
	description?: string | null;
	avatar?: string | null;
	heroImage?: string | null;
	heroLogo?: string | null;
	accentColorLight?: string | null;
	accentColorDark?: string | null;
	website?: string | null;
	email?: string | null;
	communityCreationEnabled?: boolean;
	communityCloneAccess?: 'off' | 'everyone' | 'managers';
	isActive?: boolean;
	isPrivate?: boolean;
}) => {
	const org = await Org.create(values);
	return org.toJSON();
};

export const updateOrg = async (
	id: string,
	values: Partial<{
		slug: string;
		title: string;
		subtitle: string | null;
		description: string | null;
		avatar: string | null;
		heroImage: string | null;
		heroLogo: string | null;
		accentColorLight: string | null;
		accentColorDark: string | null;
		website: string | null;
		email: string | null;
		communityCreationEnabled: boolean;
		communityCloneAccess: 'off' | 'everyone' | 'managers';
		isActive: boolean;
		isPrivate: boolean;
		domains: string[];
		pubSearchTerms: string[];
	}>,
) => {
	await Org.update(values, { where: { id } });
	return Org.findByPk(id);
};

export const destroyOrg = async (id: string) => {
	return Org.destroy({ where: { id } });
};

export const addCommunityToOrg = async (
	orgId: string,
	communityId: string,
	opts?: { dataAccess?: 'none' | 'requested' | 'granted'; showOnLandingPage?: boolean },
) => {
	const [record, created] = await HubCommunity.findOrCreate({
		where: { orgId, communityId },
		defaults: {
			dataAccess: opts?.dataAccess ?? 'none',
			...(opts?.showOnLandingPage !== undefined && {
				showOnLandingPage: opts.showOnLandingPage,
			}),
		} as any,
	});
	// If the record already exists and we're upgrading access, update it
	if (!created && opts?.dataAccess && record.dataAccess !== opts.dataAccess) {
		await record.update({ dataAccess: opts.dataAccess });
	}
	return record.toJSON();
};

export const removeCommunityFromOrg = async (orgId: string, communityId: string) => {
	return HubCommunity.destroy({
		where: { orgId, communityId },
	});
};

export const getHubCommunities = async (orgId: string) => {
	const associations = await HubCommunity.findAll({
		where: { orgId },
		include: [
			{
				model: Community,
				attributes: [
					'id',
					'subdomain',
					'domain',
					'title',
					'description',
					'heroBackgroundImage',
					'heroLogo',
					'accentColorLight',
					'accentColorDark',
					'headerLogo',
					'headerColorType',
					'createdAt',
					'updatedAt',
				],
				include: [
					{
						model: SpamTag,
						as: 'spamTag',
						attributes: ['status'],
						required: false,
					},
				],
			},
		],
	});
	return associations
		.map((a) => {
			const aj = a.toJSON() as any;
			const community = aj.community;
			if (!community) return null;
			if (community.spamTag?.status === 'confirmed') return null;
			return {
				...community,
				showOnLandingPage: aj.showOnLandingPage,
				dataAccess: aj.dataAccess,
			};
		})
		.filter(Boolean);
};

/**
 * Find all orgs a community belongs to.
 */
export const getOrgsForCommunity = async (communityId: string) => {
	const associations = await HubCommunity.findAll({
		where: { communityId },
		include: [{ model: Org }],
	});
	return associations.map((a) => (a as any).org?.toJSON()).filter(Boolean);
};

/* ------------------------------------------------------------------ */
/* Org Managers                                               */
/* ------------------------------------------------------------------ */

export const getOrgMembers = async (orgId: string) => {
	const managers = await OrgMember.findAll({
		where: { orgId },
		include: [
			{
				model: User,
				attributes: ['id', 'fullName', 'slug', 'avatar', 'initials'],
			},
		],
	});
	return managers.map((m) => {
		const mj = m.toJSON() as any;
		return {
			id: mj.id,
			userId: mj.userId,
			orgId: mj.orgId,
			user: mj.user || null,
		};
	});
};

export const addOrgMember = async (orgId: string, userId: string) => {
	const [record] = await OrgMember.findOrCreate({
		where: { orgId, userId },
	});
	return record.toJSON();
};

export const removeOrgMember = async (orgId: string, userId: string) => {
	return OrgMember.destroy({ where: { orgId, userId } });
};

/** Check whether a user is a manager of any org */
export const isUserOrgMember = async (userId: string, orgId: string): Promise<boolean> => {
	const count = await OrgMember.count({ where: { orgId, userId } });
	return count > 0;
};
