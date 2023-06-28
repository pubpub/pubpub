/* eslint-disable global-require */

import passportLocalSequelize from 'passport-local-sequelize';
import { createSequelizeModelsFromFacetDefinitions } from './facets/create';
import { sequelize } from './sequelize';

/* Import and create all models. */
/* Also import them to make them available to other modules */

import { Collection } from './collection/new-model';

import { CollectionAttribution } from './collectionAttribution/new-model';
import { CollectionPub } from './collectionPub/new-model';
import { Commenter } from './commenter/new-model';
import { Community } from './community/new-model';
import { CommunityAdmin } from './communityAdmin/new-model';
import { CrossrefDepositRecord } from './crossrefDepositRecord/new-model';
import { CustomScript } from './customScript/new-model';
import { DepositTarget } from './depositTarget/new-model';
import { Discussion } from './discussion/new-model';
import { DiscussionAnchor } from './discussionAnchor/new-model';
import { Doc } from './doc/new-model';
import { Draft } from './draft/new-model';
import { Export } from './export/new-model';
import { ExternalPublication } from './externalPublication/new-model';
import { FeatureFlag } from './featureFlag/new-model';
import { FeatureFlagUser } from './featureFlagUser/new-model';
import { FeatureFlagCommunity } from './featureFlagCommunity/new-model';
import { ZoteroIntegration } from './zoteroIntegration/new-model';
import { IntegrationDataOAuth1 } from './integrationDataOAuth1/new-model';
import { LandingPageFeature } from './landingPageFeature/new-model';
import { Member } from './member/new-model';
import { Merge } from './merge/new-model';
import { Organization } from './organization/new-model';
import { Page } from './page/new-model';
import { Pub } from './pub/new-model';
import { PubAttribution } from './pubAttribution/new-model';
import { PubEdge } from './pubEdge/new-model';
import { PubManager } from './pubManager/new-model';
import { PubVersion } from './pubVersion/new-model';
import { PublicPermissions } from './publicPermissions/new-model';
import { Release } from './release/new-model';
import { ReviewEvent } from './reviewEvent/new-model';
import { ScopeSummary } from './scopeSummary/new-model';
import { Submission } from './submission/new-model';
import { Signup } from './signup/new-model';
import { SpamTag } from './spamTag/new-model';
import { SubmissionWorkflow } from './submissionWorkflow/new-model';
import { ReviewNew } from './review/new-model';
import { Reviewer } from './reviewer/new-model';
import { Thread } from './thread/new-model';
import { ThreadComment } from './threadComment/new-model';
import { ThreadEvent } from './threadEvent/new-model';
import { User } from './user/new-model-with-declare';
// import { attributesPublicUser, includeUserModel } from './user/model';
import { UserDismissable } from './userDismissable/new-model';
import { UserNotification } from './userNotification/new-model';
import { UserNotificationPreferences } from './userNotificationPreferences/new-model';
import { UserScopeVisit } from './userScopeVisit/new-model';
import { UserSubscription } from './userSubscription/new-model';
import { ActivityItem } from './activityItem/new-model';
import { Visibility } from './visibility/new-model';
import { VisibilityUser } from './visibilityUser/new-model';
import { WorkerTask } from './workerTask/new-model';

export const { facetModels, FacetBinding } = createSequelizeModelsFromFacetDefinitions(sequelize);

sequelize.addModels([
	Collection,
	CollectionAttribution,
	CollectionPub,
	Commenter,
	Community,
	CommunityAdmin,
	CrossrefDepositRecord,
	CustomScript,
	DepositTarget,
	Discussion,
	DiscussionAnchor,
	Doc,
	Draft,
	Export,
	ExternalPublication,
	FeatureFlag,
	FeatureFlagUser,
	FeatureFlagCommunity,
	ZoteroIntegration,
	IntegrationDataOAuth1,
	LandingPageFeature,
	Member,
	Merge,
	Organization,
	Page,
	Pub,
	PubAttribution,
	PubEdge,
	PubManager,
	PubVersion,
	PublicPermissions,
	Release,
	ReviewEvent,
	ScopeSummary,
	Submission,
	Signup,
	SpamTag,
	SubmissionWorkflow,
	ReviewNew,
	Reviewer,
	Thread,
	ThreadComment,
	ThreadEvent,
	User,
	//	attributesPublicUser,
	//	includeUserModel,
	UserDismissable,
	UserNotification,
	UserNotificationPreferences,
	UserScopeVisit,
	UserSubscription,
	ActivityItem,
	Visibility,
	VisibilityUser,
	WorkerTask,
]);

passportLocalSequelize.attachToUser(User, {
	usernameField: 'email',
	hashField: 'hash',
	saltField: 'salt',
	digest: 'sha512',
	iterations: 25000,
});

export const attributesPublicUser = [
	'id',
	'firstName',
	'lastName',
	'fullName',
	'avatar',
	'slug',
	'initials',
	'title',
	'orcid',
] as const;

export const includeUserModel = (() => {
	return (options) => {
		const { attributes: providedAttributes = [], ...restOptions } = options;
		const attributes = [...new Set([...attributesPublicUser, ...providedAttributes])];
		// eslint-disable-next-line pubpub-rules/no-user-model
		return {
			model: User,
			attributes,
			...restOptions,
		};
	};
})();

/* Create associations for models that have associate function */
// Object.values(sequelize.models).forEach((model) => {
// 	console.log(model);
// 	// @ts-expect-error (interpreting this file as vanilla JavaScript from test runner)
// 	const classMethods = model.options.classMethods || {};
// 	if (classMethods.associate) {
// 		classMethods.associate(sequelize.models);
// 	}
// });

export {
	Collection,
	CollectionAttribution,
	CollectionPub,
	Commenter,
	Community,
	CommunityAdmin,
	CrossrefDepositRecord,
	CustomScript,
	DepositTarget,
	Discussion,
	DiscussionAnchor,
	Doc,
	Draft,
	Export,
	ExternalPublication,
	FeatureFlag,
	FeatureFlagUser,
	FeatureFlagCommunity,
	ZoteroIntegration,
	IntegrationDataOAuth1,
	LandingPageFeature,
	Member,
	Merge,
	Organization,
	Page,
	Pub,
	PubAttribution,
	PubEdge,
	PubManager,
	PubVersion,
	PublicPermissions,
	Release,
	ReviewEvent,
	ScopeSummary,
	Submission,
	Signup,
	SpamTag,
	SubmissionWorkflow,
	ReviewNew,
	Reviewer,
	Thread,
	ThreadComment,
	ThreadEvent,
	User,
	UserDismissable,
	UserNotification,
	UserNotificationPreferences,
	UserScopeVisit,
	UserSubscription,
	ActivityItem,
	Visibility,
	VisibilityUser,
	WorkerTask,
};

/** This import is here to guarantee that when you import the `sequelize` object
    all the models will be defined on it.

    In previous versions of Sequelize, the models were defined by importing it
    in the object using `Sequlize.import`. This is no longer the case, instead
    we first create the sequelize object and then import it in the relevant 
    `model.ts` file.

    TD:DR if you get "Model is not defined" errors, make sure you import the
    `sequelize` object from this file, not form `server/sequelize.ts`.
*/
export { sequelize };
