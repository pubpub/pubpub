import { User, Community } from 'server/models';

import { buildImportPlan, printImportPlan } from './plan';
import { resolveImportPlan } from './resolve';

const getActor = async (userSlug) => {
	if (!userSlug) {
		throw new Error('Specify an actor to run bulk import');
	}
	const user = await User.findOne({ where: { slug: userSlug } });
	if (!user) {
		throw new Error(`No user by slug ${userSlug}`);
	}
	return user;
};

const getCommunity = async (subdomain) => {
	if (!subdomain) {
		return null;
	}
	const community = await Community.findOne({ where: { subdomain: subdomain } });
	if (!community) {
		throw new Error(`No Community by subdomain ${subdomain}`);
	}
	return community;
};

export const runBulkImportFromDirectory = async (rootDirectory, args) => {
	const plan = await buildImportPlan(rootDirectory);
	const community = await getCommunity(args.community);
	const actor = await getActor(args.actor);
	printImportPlan(plan);
	const resolvedPlan = await resolveImportPlan({
		importPlan: plan,
		parents: { community: community },
		actor: actor,
	});
	console.log(JSON.stringify(resolvedPlan));
};
