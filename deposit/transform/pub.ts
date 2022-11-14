import { Resource, ResourceKind } from '../types';
import { Pub } from 'types';

function getResourceKindForPub(pub: Pub): ResourceKind {}

export async function transformPubToResource(pub: Pub): Resource {
	return {
		id: pub.id,
	};
}
