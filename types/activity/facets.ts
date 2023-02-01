import { Diff } from '../util';
import { InsertableActivityItemBase } from './base';

export type FacetInstanceUpdatedActivityItem = InsertableActivityItemBase & {
	kind: 'facet-instance-updated-activity-item';
	payload: {
		facetName: string;
		facetProps: Diff<Record<string, any>>;
	};
};

export type FacetsActivityItem = FacetInstanceUpdatedActivityItem;
