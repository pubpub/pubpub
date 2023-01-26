import { FacetDefinition, FacetInstance } from './facet';

export function createDefaultFacetInstnace<
	Definition extends FacetDefinition,
	Type = FacetInstance<Definition>,
>(definition: Definition): Type {
	const { props } = definition;
	const defaultFacet: Partial<Type> = {};
	Object.entries(props).forEach(([key, prop]) => {
		const value = prop.defaultValue ?? null;
		defaultFacet[key as keyof Type] = value;
	});
	return defaultFacet as Type;
}

export function createFacetInstance<Definition extends FacetDefinition>(
	definition: Definition,
	values: Partial<FacetInstance<Definition>> = {},
): FacetInstance<Definition> {
	return {
		...createDefaultFacetInstnace(definition),
		...values,
	};
}
