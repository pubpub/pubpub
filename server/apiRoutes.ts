import { isProd } from 'utils/environment';

require('./activityItem/api');
require('./citation/api');
require('./collectionAttribution/api');
require('./collection/api');
require('./collectionPub/api');
require('./community/api');
require('./communityServices/api');
require('./customScript/api');
require('./discussion/api');
require('./doi/api');
require('./download/api');
require('./editor/api');
require('./export/api');
require('./facets/api');
require('./import/api');
require('./integrationDataOAuth1/api');
require('./landingPageFeature/api');
require('./layout/api');
require('./logout/api');
require('./login/api');
require('./member/api');
require('./openSearch/api');
require('./page/api');
require('./passwordReset/api');
require('./pub/api');
require('./pubAttribution/api');
require('./pubEdge/api');
require('./pubEdgeProposal/api');
require('./pubHistory/api');
require('./release/api');
require('./review/api');
require('./reviewer/api');
require('./rss/api');
require('./search/api');
require('./signup/api');
require('./spamTag/api');
require('./subscribe/api');
require('./submissionWorkflow/api');
require('./submission/api');
require('./threadComment/api');
require('./uploadPolicy/api');
require('./user/api');
require('./userDismissable/api');
require('./userNotification/api');
require('./userNotificationPreferences/api');
require('./userSubscription/api');
require('./workerTask/api');
require('./zoteroIntegration/api');

require('./apiDocs/api');

if (!isProd()) {
	// eslint-disable-next-line global-require
	require('./dev/api');
}
