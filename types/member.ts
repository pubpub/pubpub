import { Member as MemberModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type MemberPermission = 'view' | 'edit' | 'manage' | 'admin';

export type Member = RecursiveAttributes<MemberModel>;
