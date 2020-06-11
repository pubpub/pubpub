/* eslint-disable no-restricted-syntax */
import {
	resolveCommunityDirective,
	resolveCollectionDirective,
	resolvePubDirective,
} from './directives';
import { BulkImportError } from './errors';

const resolveDirective = async ({ directive, actor, targetPath, parents }) => {
	const { community } = parents;
	if (directive.type === 'community') {
		if (community) {
			throw new BulkImportError(
				{ directive: directive, path: targetPath },
				'Cannot create a Community when one is already defined in scope.',
			);
		}
		const resolved = await resolveCommunityDirective({ directive: directive });
		return { resolved: resolved, parents: { community: resolved.community } };
	}
	if (directive.type === 'collection') {
		if (!community) {
			throw new BulkImportError(
				{ directive: directive, path: targetPath },
				'Cannot create a Collection without a parent Community.',
			);
		}
		const resolved = await resolveCollectionDirective({
			directive: directive,
			community: community,
		});
		return { resolved: resolved, parents: { collection: resolved.collection } };
	}
	if (directive.type === 'pub') {
		if (!community) {
			throw new BulkImportError(
				{ directive: directive, path: targetPath },
				'Cannot create a Pub without a parent Community.',
			);
		}
		const resolved = await resolvePubDirective({
			directive: directive,
			targetPath: targetPath,
			community: community,
			actor: actor,
		});
		return { resolved: resolved };
	}
};

export const resolveImportPlan = async ({ importPlan, actor, parents }) => {
	let currentParents = { ...parents };
	const { directives, path, children } = importPlan;
	const toResolveWithChildren = [];
	const resolvedValues = [];

	for (const directive of directives) {
		// eslint-disable-next-line no-await-in-loop
		const { resolved, parents: nextParents } = await resolveDirective({
			directive: directive,
			actor: actor,
			targetPath: path,
			parents: currentParents,
		});
		resolvedValues.push(resolved);
		currentParents = { ...currentParents, ...nextParents };
		if (resolved.onResolvedChildren) {
			toResolveWithChildren.push(resolved.onResolvedChildren);
		}
	}

	if (children && children.length > 0) {
		const resolvedChildPlans = await Promise.all(
			children.map((childPlan) =>
				resolveImportPlan({ importPlan: childPlan, actor: actor, parents: currentParents }),
			),
		);

		const resolvedByChildren = resolvedChildPlans
			.map((plan) => plan.resolved)
			.reduce((a, b) => [...a, ...b], []);

		await Promise.all(toResolveWithChildren.map((callback) => callback(resolvedByChildren)));
		return { ...importPlan, resolved: resolvedValues, children: resolvedChildPlans };
	}

	return { ...importPlan, resolved: resolvedValues };
};
