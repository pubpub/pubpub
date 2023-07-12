/* eslint-disable global-require */

import passportLocalSequelize from 'passport-local-sequelize';
import { createSequelizeModelsFromFacetDefinitions } from './facets/create';
import { sequelize } from './sequelize';

/* Import and create all models. */
/* Also import them to make them available to other modules */

import { CollectionAnyModel as Collection } from './collection/new-model';

import { CollectionAttributionAnyModel as CollectionAttribution } from './collectionAttribution/new-model';
import { CollectionPubAnyModel as CollectionPub } from './collectionPub/new-model';
import { CommenterAnyModel as Commenter } from './commenter/new-model';
import { CommunityAnyModel as Community } from './community/new-model';
import { CommunityAdminAnyModel as CommunityAdmin } from './communityAdmin/new-model';
import { CrossrefDepositRecordAnyModel as CrossrefDepositRecord } from './crossrefDepositRecord/new-model';
import { CustomScriptAnyModel as CustomScript } from './customScript/new-model';
import { DepositTargetAnyModel as DepositTarget } from './depositTarget/new-model';
import { DiscussionAnyModel as Discussion } from './discussion/new-model';
import { DiscussionAnchorAnyModel as DiscussionAnchor } from './discussionAnchor/new-model';
import { DocAnyModel as Doc } from './doc/new-model';
import { DraftAnyModel as Draft } from './draft/new-model';
import { ExportAnyModel as Export } from './export/new-model';
import { ExternalPublicationAnyModel as ExternalPublication } from './externalPublication/new-model';
import { FeatureFlagAnyModel as FeatureFlag } from './featureFlag/new-model';
import { FeatureFlagUserAnyModel as FeatureFlagUser } from './featureFlagUser/new-model';
import { FeatureFlagCommunityAnyModel as FeatureFlagCommunity } from './featureFlagCommunity/new-model';
import { ZoteroIntegrationAnyModel as ZoteroIntegration } from './zoteroIntegration/new-model';
import { IntegrationDataOAuth1AnyModel as IntegrationDataOAuth1 } from './integrationDataOAuth1/new-model';
import { LandingPageFeatureAnyModel as LandingPageFeature } from './landingPageFeature/new-model';
import { MemberAnyModel as Member } from './member/new-model';
import { MergeAnyModel as Merge } from './merge/new-model';
import { OrganizationAnyModel as Organization } from './organization/new-model';
import { PageAnyModel as Page } from './page/new-model';
import { PubAnyModel as Pub } from './pub/new-model';
import { PubAttributionAnyModel as PubAttribution } from './pubAttribution/new-model';
import { PubEdgeAnyModel as PubEdge } from './pubEdge/new-model';
import { PubManagerAnyModel as PubManager } from './pubManager/new-model';
import { PubVersionAnyModel as PubVersion } from './pubVersion/new-model';
import { PublicPermissionsAnyModel as PublicPermissions } from './publicPermissions/new-model';
import { ReleaseAnyModel as Release } from './release/new-model';
import { ReviewEventAnyModel as ReviewEvent } from './reviewEvent/new-model';
import { ScopeSummaryAnyModel as ScopeSummary } from './scopeSummary/new-model';
import { SubmissionAnyModel as Submission } from './submission/new-model';
import { SignupAnyModel as Signup } from './signup/new-model';
import { SpamTagAnyModel as SpamTag } from './spamTag/new-model';
import { SubmissionWorkflowAnyModel as SubmissionWorkflow } from './submissionWorkflow/new-model';
import { ReviewNewAnyModel as ReviewNew } from './review/new-model';
import { ReviewerAnyModel as Reviewer } from './reviewer/new-model';
import { ThreadAnyModel as Thread } from './thread/new-model';
import { ThreadCommentAnyModel as ThreadComment } from './threadComment/new-model';
import { ThreadEventAnyModel as ThreadEvent } from './threadEvent/new-model';
import { UserAnyModel as User } from './user/new-model';
// import { attributesPublicUser, includeUserModel } from './user/model';
import { UserDismissableAnyModel as UserDismissable } from './userDismissable/new-model';
import { UserNotificationAnyModel as UserNotification } from './userNotification/new-model';
import { UserNotificationPreferencesAnyModel as UserNotificationPreferences } from './userNotificationPreferences/new-model';
import { UserScopeVisitAnyModel as UserScopeVisit } from './userScopeVisit/new-model';
import { UserSubscriptionAnyModel as UserSubscription } from './userSubscription/new-model';
import { ActivityItemAnyModel as ActivityItem } from './activityItem/new-model';
import { VisibilityAnyModel as Visibility } from './visibility/new-model';
import { FacetBindingAnyModel as FacetBindingModel } from './facets/models/new-facetBinding';
import { VisibilityUserAnyModel as VisibilityUser } from './visibilityUser/new-model';
import { WorkerTaskAnyModel as WorkerTask } from './workerTask/new-model';

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
	FacetBindingModel,
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

export const { facetModels, FacetBinding } = createSequelizeModelsFromFacetDefinitions(sequelize);

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
];

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
