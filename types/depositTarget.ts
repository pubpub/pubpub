import { DepositTarget as DepositTargetModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type DepositTarget = RecursiveAttributes<DepositTargetModel>;
