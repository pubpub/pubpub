import { Sequelize } from 'sequelize-typescript';
import { CollectionPub } from './collectionPub';
import { Collection } from './collection';
import { Pub } from './pub';

const sequelize = new Sequelize();

sequelize.addModels([CollectionPub, Collection, Pub]);

const collection = new Collection({
	slug: 'test',
});

let weirdlyDeepPubTitle =
	//  ^?
	collection.collectionPubs[0].pub.title;

const pub = await Pub.findOne({
	where: {
		title: 'test',
	},
});

pub?.collectionPubs[0].collection.slug;
