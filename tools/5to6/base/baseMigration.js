import {
	Community as v5_Community,
	CommunityAdmin as v5_CommunityAdmin,
	Discussion as v5_Discussion,
	Pub as v5_Pub,
	Signup as v5_Signup,
	User as v5_User,
	Version as v5_Version,
	WorkerTask as v5_WorkerTask,
	PubManager as v5_PubManager,
	VersionPermission as v5_VersionPermission,
	PubAttribution as v5_PubAttribution,
	Tag as v5_Tag,
	PubTag as v5_PubTag,
	Page as v5_Page,
	DiscussionChannel as v5_DiscussionChannel,
	DiscussionChannelParticipant as v5_DiscussionChannelParticipant,
} from '../v5/models';

import {
	Branch as v6_Branch,
	BranchPermission as v6_BranchPermission,
	Collection as v6_Collection,
	CollectionAttribution as v6_CollectionAttribution,
	CollectionPub as v6_CollectionPub,
	Community as v6_Community,
	CommunityAdmin as v6_CommunityAdmin,
	Discussion as v6_Discussion,
	DiscussionChannel as v6_DiscussionChannel,
	DiscussionChannelParticipant as v6_DiscussionChannelParticipant,
	Merge as v6_Merge,
	Page as v6_Page,
	Pub as v6_Pub,
	PubAttribution as v6_PubAttribution,
	PubManager as v6_PubManager,
	PubVersion as v6_PubVersion,
	PubTag as v6_PubTag,
	Signup as v6_Signup,
	Review as v6_Review,
	ReviewEvent as v6_ReviewEvent,
	Tag as v6_Tag,
	User as v6_User,
	Version as v6_Version,
	VersionPermission as v6_VersionPermission,
	WorkerTask as v6_WorkerTask,
} from '../../../server/models';

Promise.all([])
.then(() => {
	// return v5_Community.findAll().then((communitiesData) => {
	// 	const dataJSON = communitiesData.map((community) => {
	// 		return community.toJSON();
	// 	});
	// 	return v6_Community.bulkCreate(dataJSON);
	// });
})
.then(() => {
	return v5_Pub.findAll().then((pubsData) => {
		const dataJSON = pubsData.map((pub) => {
			return pub.toJSON();
		});
		return v6_Pub.bulkCreate(dataJSON);
	});
})
.catch((err) => {
	console.log('Error with Migration', err);
})
.finally(() => {
	console.log('Ending Migration');
	process.exit();
});