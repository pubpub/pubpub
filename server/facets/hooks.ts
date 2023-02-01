import { FacetDefinition } from 'facets';
import { createActivityHooks } from 'server/utils/activityHooks';

export const createSequelizeHooksForFacetModel = (definition: FacetDefinition, Model: any) => {
	createActivityHooks({
		Model,
	});
};
