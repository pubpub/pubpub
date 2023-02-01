import { Diff } from '../util';
import { InsertableActivityItemBase } from './base';

export type FacetInstanceUpdatedActivityItem = InsertableActivityItemBase & {
	kind: 'facet-instance-updated';
	payload: {
		facetName: string;
		facetProps: Diff<Record<string, any>>;
	};
};

export type FacetsActivityItem = FacetInstanceUpdatedActivityItem;
