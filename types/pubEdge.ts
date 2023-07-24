import {
	ExternalPublication as ExternalPublicationModel,
	PubEdge as PubEdgeModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type ExternalPublication = RecursiveAttributes<ExternalPublicationModel>;

export type PubEdge = RecursiveAttributes<PubEdgeModel>;

export type OutboundEdge = Omit<PubEdge, 'pub'>;
export type InboundEdge = Omit<PubEdge, 'targetPub'>;
