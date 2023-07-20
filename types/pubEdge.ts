import { Attributes } from 'sequelize';
import {
	ExternalPublication as ExternalPublicationModel,
	PubEdge as PubEdgeModel,
} from 'server/models';

export type ExternalPublication = Attributes<ExternalPublicationModel>;

export type PubEdge = Attributes<PubEdgeModel>;

export type OutboundEdge = Omit<PubEdge, 'pub'>;
export type InboundEdge = Omit<PubEdge, 'targetPub'>;
