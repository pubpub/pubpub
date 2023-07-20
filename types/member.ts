import { Attributes } from 'sequelize';
import { Member as MemberModel } from 'server/models';

export type MemberPermission = 'view' | 'edit' | 'manage' | 'admin';

export type Member = Attributes<MemberModel>;
