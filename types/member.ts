import { Member as MemberModel } from 'server/models';
import { SerializedModel } from './recursiveAttributes';

export type MemberPermission = 'view' | 'edit' | 'manage' | 'admin';

export type Member = SerializedModel<MemberModel>;
