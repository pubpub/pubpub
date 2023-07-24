import { Attributes } from 'sequelize';
import { ReviewNew as ReviewNewModel, Reviewer as ReviewerModel } from 'server/models';

export type Review = Attributes<ReviewNewModel>;

export type Reviewer = Attributes<ReviewerModel>;
