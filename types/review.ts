import { ReviewNew as ReviewNewModel, Reviewer as ReviewerModel } from 'server/models';
import { SerializedModel } from './recursiveAttributes';

export type Review = SerializedModel<ReviewNewModel>;

export type Reviewer = SerializedModel<ReviewerModel>;
