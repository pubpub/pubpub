import { Attributes } from 'sequelize';
import { Community as CommunityModel } from 'server/models';

export type CommunityHeroButton = {
	title: string;
	url: string;
};

export type CommunityHeaderLink = { title: string; url: string; external?: boolean };

export type Community = Attributes<CommunityModel>;
