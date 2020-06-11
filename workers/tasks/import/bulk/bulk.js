import { User } from 'server/models';

import { BulkImportError } from './errors';
import { directiveFileSuffix } from './constants';
import { createContext } from './context';
import {
	resolvePubDirective,
	resolveCollectionDirective,
	resolveCommunityDirective,
} from './directives';
import { createTarget } from './target';
import { buildImportPlan } from './plan';

const findUserForSlug = async (slug) => {
	const user = await User.findOne({ where: { slug: slug } });
	if (!user) {
		throw new BulkImportError({}, `Could not find user by slug ${slug}`);
	}
};

const applyDirective = async (filePath, directive, context) => {
	const target = await createTarget(filePath);
	if (directive.type === 'pub') {
		return resolvePubDirective(directive, target, context);
	}
	if (directive.type === 'collection') {
		return resolveCollectionDirective(directive, target, context);
	}
	if (directive.type === 'community') {
		return resolveCommunityDirective(directive, target, context);
	}
	throw new BulkImportError(
		{ directive: directive },
		`${directive.type} is an invalid directive type`,
	);
};

export const runBulkImportFromDirectory = async (rootDirectory, args) => {
	const plan = await buildImportPlan(rootDirectory);
	console.log(JSON.stringify(plan));
};
