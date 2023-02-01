import {
	Facet,
	FacetInstance,
	ALL_FACET_DEFINITIONS,
	parsePartialFacetInstance,
	SingleScopeId,
	FacetName,
	Facets,
} from 'facets';
import { FacetBinding, facetModels } from 'server/models';

type UpdateFacetByName<Name extends FacetName> = Partial<FacetInstance<Facets[Name]>>;
type UpdateFacetsQuery = Partial<{
	[Name in FacetName]: UpdateFacetByName<Name>;
}>;

const updateFacetForScope = async <Name extends FacetName>(
	scope: SingleScopeId,
	facet: Facet<Name>,
	update: UpdateFacetByName<Name>,
	actorId: string | null = null,
) => {
	const FacetModel = facetModels[facet.name];
	const existing = await FacetModel.findOne({
		include: [
			{
				model: FacetBinding,
				as: 'facetBinding',
				where: { ...scope },
				required: true,
			},
		],
	});
	if (existing) {
		await existing.update(update, { actorId });
	} else {
		const facetBinding = await FacetBinding.create({ ...scope });
		await FacetModel.create({ ...update, facetBindingId: facetBinding.id }, { actorId });
	}
};

export const updateFacetsForScope = async (
	scope: SingleScopeId,
	update: UpdateFacetsQuery,
	actorId: string | null = null,
) => {
	await Promise.all(
		Object.entries(update).map(async ([facetName, facetUpdate]) => {
			const facet = ALL_FACET_DEFINITIONS[facetName];
			const { valid: parsedUpdate } = parsePartialFacetInstance(
				facet,
				facetUpdate as any,
				true,
			);
			if (Object.keys(parsedUpdate).length > 0) {
				await updateFacetForScope(scope, facet, parsedUpdate, actorId);
			}
		}),
	);
};
