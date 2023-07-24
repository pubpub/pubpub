import { ReviewNew as ReviewNewModel, Reviewer as ReviewerModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type Review = RecursiveAttributes<ReviewNewModel>;

export type Reviewer = RecursiveAttributes<ReviewerModel>;
