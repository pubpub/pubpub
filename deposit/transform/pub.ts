import { Resource, ResourceKind } from '../types';
import { Pub } from 'types';

function getResourceKindForPub(pub: Pub): ResourceKind {}

export function transform(pub: Pub): Resource {
	return {
		id: pub.id,
	};
}
