import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_DATA_LOAD,
	GET_PUB_DATA_SUCCESS,
	GET_PUB_DATA_FAIL,
	PUT_PUB_DATA_LOAD,
	PUT_PUB_DATA_SUCCESS,
	PUT_PUB_DATA_FAIL,
} from 'containers/Pub/actions';

import {
	POST_CONTRIBUTOR_LOAD,
	POST_CONTRIBUTOR_SUCCESS,
	POST_CONTRIBUTOR_FAIL,

	PUT_CONTRIBUTOR_LOAD,
	PUT_CONTRIBUTOR_SUCCESS,
	PUT_CONTRIBUTOR_FAIL,
	
	DELETE_CONTRIBUTOR_LOAD,
	DELETE_CONTRIBUTOR_SUCCESS,
	DELETE_CONTRIBUTOR_FAIL,
} from 'containers/Pub/actionsContributors';

import {
	POST_VERSION_LOAD,
	POST_VERSION_SUCCESS,
	POST_VERSION_FAIL,
	PUT_VERSION_LOAD,
	PUT_VERSION_SUCCESS,
	PUT_VERSION_FAIL,
} from 'containers/Pub/actionsVersions';

import {
	POST_JOURNAL_SUBMIT_LOAD,
	POST_JOURNAL_SUBMIT_SUCCESS,
	POST_JOURNAL_SUBMIT_FAIL,

	PUT_FEATURE_LOAD,
	PUT_FEATURE_SUCCESS,
	PUT_FEATURE_FAIL,

	PUT_PUB_CONTEXT_LOAD,
	PUT_PUB_CONTEXT_SUCCESS,
	PUT_PUB_CONTEXT_FAIL,
} from 'containers/Pub/actionsJournals';

import {
	POST_DISCUSSION_LOAD,
	POST_DISCUSSION_SUCCESS,
	POST_DISCUSSION_FAIL,

	PUT_DISCUSSION_LOAD,
	PUT_DISCUSSION_SUCCESS,
	PUT_DISCUSSION_FAIL,

	POST_REACTION_LOAD,
	POST_REACTION_SUCCESS,
	POST_REACTION_FAIL,

	DELETE_REACTION_LOAD,
	DELETE_REACTION_SUCCESS,
	DELETE_REACTION_FAIL,
} from 'containers/Pub/actionsDiscussions';

import {
	POST_REVIEWER_LOAD,
	POST_REVIEWER_SUCCESS,
	POST_REVIEWER_FAIL,

	PUT_REVIEWER_LOAD,
	PUT_REVIEWER_SUCCESS,
	PUT_REVIEWER_FAIL,
} from 'containers/Pub/actionsReviewers';

import {
	POST_PUB_LABEL_LOAD,
	POST_PUB_LABEL_SUCCESS,
	POST_PUB_LABEL_FAIL,

	DELETE_PUB_LABEL_LOAD,
	DELETE_PUB_LABEL_SUCCESS,
	DELETE_PUB_LABEL_FAIL,
} from 'containers/Pub/actionsPubLabels';

import {
	POST_LABEL_LOAD,
	POST_LABEL_SUCCESS,
	POST_LABEL_FAIL,

	PUT_LABEL_LOAD,
	PUT_LABEL_SUCCESS,
	PUT_LABEL_FAIL,

	DELETE_LABEL_LOAD,
	DELETE_LABEL_SUCCESS,
	DELETE_LABEL_FAIL,
} from 'containers/Pub/actionsLabels';

import {
	PUT_DEFAULT_FILE_LOAD,
	PUT_DEFAULT_FILE_SUCCESS,
	PUT_DEFAULT_FILE_FAIL,
} from 'containers/Pub/actionsFiles';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	contributorsLoading: false,
	contributorsError: undefined,
	versionsLoading: false,
	versionsError: undefined,
	journalsLoading: false,
	journalsError: undefined,
	settingsLoading: false,
	settingsError: undefined,
	discussionsLoading: false,
	discussionsError: undefined,
	inviteReviewerLoading: false,
	inviteReviewerError: undefined,
	updateReviewerLoading: false,
	updateReviewerError: undefined,
	pub: {},
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_PUB_DATA_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
			pub: {},
		});	
	case GET_PUB_DATA_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			pub: action.result
		});
	case GET_PUB_DATA_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
			pub: null,
		});

	case PUT_PUB_DATA_LOAD:
		return state.merge({
			settingsLoading: true,
			settingsError: undefined,
		});	
	case PUT_PUB_DATA_SUCCESS:
		return state.merge({
			settingsLoading: false,
			settingsError: undefined,
		})
		.mergeIn(
			['pub'], 
			action.updateData
		);
	case PUT_PUB_DATA_FAIL:
		return state.merge({
			settingsLoading: false,
			settingsError: action.error,
		});

	case POST_CONTRIBUTOR_LOAD:
		return state.merge({
			contributorsLoading: true,
			contributorsError: undefined,
		});	
	case POST_CONTRIBUTOR_SUCCESS:
		return state.merge({
			contributorsLoading: false,
			contributorsError: undefined,
		})
		.mergeIn(
			['pub', 'contributors'], 
			state.getIn(['pub', 'contributors']).unshift(ensureImmutable(action.result))
		);
	case POST_CONTRIBUTOR_FAIL:
		return state.merge({
			contributorsLoading: false,
			contributorsError: action.error,
		});
	case PUT_CONTRIBUTOR_LOAD:
		return state.merge({
			contributorsLoading: true,
			contributorsError: undefined,
		});	
	case PUT_CONTRIBUTOR_SUCCESS:
		return state.merge({
			contributorsLoading: false,
			contributorsError: undefined,
		})
		.mergeIn(
			['pub', 'contributors'], 
			state.getIn(['pub', 'contributors']).map((contributor)=> {
				if (contributor.get('id') === action.contributorId) {
					return contributor.set('isAuthor', action.isAuthor);
				}
				return contributor;
			})
		);
	case PUT_CONTRIBUTOR_FAIL:
		return state.merge({
			contributorsLoading: false,
			contributorsError: action.error,
		});

	case DELETE_CONTRIBUTOR_LOAD:
		return state.merge({
			contributorsLoading: true,
			contributorsError: undefined,
		});	
	case DELETE_CONTRIBUTOR_SUCCESS:
		return state.merge({
			contributorsLoading: false,
			contributorsError: undefined,
		})
		.setIn(
			['pub', 'contributors'], 
			state.getIn(['pub', 'contributors']).filter((contributor)=> {
				return contributor.get('id') !== action.deletedContributorId;
			})
		);
	case DELETE_CONTRIBUTOR_FAIL:
		return state.merge({
			contributorsLoading: false,
			contributorsError: action.error,
		});

	case POST_VERSION_LOAD:
		return state.merge({
			versionsLoading: true,
			versionsError: undefined,
		});	
	case POST_VERSION_SUCCESS:
		return state.merge({
			versionsLoading: false,
			versionsError: undefined,
		})
		.mergeIn(
			['pub', 'versions'], 
			state.getIn(['pub', 'versions']).push(ensureImmutable(action.result))
		);
	case POST_VERSION_FAIL:
		return state.merge({
			versionsLoading: false,
			versionsError: action.error,
		});

	case PUT_VERSION_LOAD:
		return state.merge({
			versionsLoading: true,
			versionsError: undefined,
		});	
	case PUT_VERSION_SUCCESS:
		return state.merge({
			versionsLoading: false,
			versionsError: undefined,
		})
		.mergeIn(
			['pub', 'versions'], 
			state.getIn(['pub', 'versions']).map((version)=> {
				if (version.get('id') === action.versionId) {
					return version.merge({
						isPublished: action.isPublished,
						isRestricted: action.isRestricted,
					});
				}
				return version;
			})
		);
	case PUT_VERSION_FAIL:
		return state.merge({
			versionsLoading: false,
			versionsError: action.error,
		});

	case POST_JOURNAL_SUBMIT_LOAD:
		return state.merge({
			journalsLoading: true,
			journalsError: undefined,
		});	
	case POST_JOURNAL_SUBMIT_SUCCESS:
		return state.merge({
			journalsLoading: false,
			journalsError: undefined,
		})
		.mergeIn(
			['pub', 'pubSubmits'], 
			state.getIn(['pub', 'pubSubmits']).push(ensureImmutable(action.result))
		);
	case POST_JOURNAL_SUBMIT_FAIL:
		return state.merge({
			journalsLoading: false,
			journalsError: action.error,
		});
	case PUT_FEATURE_LOAD:
		return state.merge({
			journalsLoading: true,
			journalsError: undefined,
		})
		.mergeIn(
			['pub', 'pubFeatures'], 
			state.getIn(['pub', 'pubFeatures']).map((feature)=> {
				if (feature.get('journalId') === action.journalId) {
					return feature.merge({
						isDisplayed: action.isDisplayed, 
						isContext: action.isContext
					});
				}
				return feature;
			})
		);	
	case PUT_FEATURE_SUCCESS:
		return state.merge({
			journalsLoading: false,
			journalsError: undefined,
		});
	case PUT_FEATURE_FAIL:
		return state.merge({
			journalsLoading: false,
			journalsError: action.error,
		});
	case PUT_PUB_CONTEXT_LOAD:
		return state.merge({
			journalsLoading: true,
			journalsError: undefined,
		})
		.setIn(['pub', 'defaultContext'], action.journalId);
	case PUT_PUB_CONTEXT_SUCCESS:
		return state.merge({
			journalsLoading: false,
			journalsError: undefined,
		});
	case PUT_PUB_CONTEXT_FAIL:
		return state.merge({
			journalsLoading: false,
			journalsError: action.error,
		});

	case POST_DISCUSSION_LOAD:
		return state.merge({
			discussionsLoading: true,
			discussionsError: undefined,
		});	
	case POST_DISCUSSION_SUCCESS:
		return state.merge({
			discussionsLoading: false,
			discussionsError: undefined,
		})
		.mergeIn(
			['pub', 'discussions'], 
			state.getIn(['pub', 'discussions']).push(ensureImmutable(action.result))
		);
	case POST_DISCUSSION_FAIL:
		return state.merge({
			discussionsLoading: false,
			discussionsError: action.error,
		});
	case PUT_DISCUSSION_LOAD:
		return state.merge({
			discussionsLoading: true,
			discussionsError: undefined,
		});	
	case PUT_DISCUSSION_SUCCESS:
		return state.merge({
			discussionsLoading: false,
			discussionsError: undefined,
		})
		.mergeIn(
			['pub', 'discussions'], 
			state.getIn(['pub', 'discussions']).map((discussion)=> {
				if (discussion.get('id') === action.pubId) {
					return discussion.merge({
						title: action.title || discussion.get('title'), 
						description: action.description || discussion.get('description')
					});
				}
				return discussion;
			})
		);
	case PUT_DISCUSSION_FAIL:
		return state.merge({
			discussionsLoading: false,
			discussionsError: action.error,
		});
	case POST_REACTION_LOAD:
		return state;	
	case POST_REACTION_SUCCESS:
		return state.mergeIn(
			['pub', 'discussions'], 
			state.getIn(['pub', 'discussions']).map((discussion)=> {
				if (discussion.get('id') === action.pubId) {
					return discussion.set('pubReactions', discussion.get('pubReactions').push(ensureImmutable(action.result)));
				}
				return discussion;
			})
		);
	case POST_REACTION_FAIL:
		return state;

	case DELETE_REACTION_LOAD:
		return state;
	case DELETE_REACTION_SUCCESS:
		return state.mergeIn(
			['pub', 'discussions'], 
			state.getIn(['pub', 'discussions']).map((discussion)=> {
				if (discussion.get('id') === action.pubId) {
					return discussion.set(
						'pubReactions',
						discussion.get('pubReactions').filter((pubReaction)=> {
							if (pubReaction.get('pubId') === action.pubId && pubReaction.get('userId') === action.accountId && pubReaction.get('reactionId') === action.reactionId) {
								return false;
							}
							return true;
						})
					);
				}
				return discussion;
			})
		);
	
	case DELETE_REACTION_FAIL:
		return state;

	case POST_REVIEWER_LOAD:
		return state.merge({
			inviteReviewerLoading: true,
			inviteReviewerError: undefined,
		});	
	case POST_REVIEWER_SUCCESS:
		return state.merge({
			inviteReviewerLoading: false,
			inviteReviewerError: undefined,
		})
		.mergeIn(
			['pub', 'invitedReviewers'], 
			state.getIn(['pub', 'invitedReviewers']).push(ensureImmutable(action.result))
		);
	case POST_REVIEWER_FAIL:
		return state.merge({
			inviteReviewerLoading: false,
			inviteReviewerError: action.error,
		});

	case PUT_REVIEWER_LOAD:
		return state.merge({
			updateReviewerLoading: true,
			updateReviewerError: undefined,
		});	
	case PUT_REVIEWER_SUCCESS:
		return state.merge({
			updateReviewerLoading: false,
			updateReviewerError: undefined,
		});
		// .mergeIn(
		// 	['pub', 'invitedReviewers'], 
		// 	state.getIn(['pub', 'invitedReviewers']).push(ensureImmutable(action.result))
		// );
	case PUT_REVIEWER_FAIL:
		return state.merge({
			updateReviewerLoading: false,
			updateReviewerError: action.error,
		});

	case POST_PUB_LABEL_LOAD:
		return state;	
	case POST_PUB_LABEL_SUCCESS:
		// Set path based on if we are adding a label to a discussion or to the pub
		const postPubLabelDiscussionIndex = state.getIn(['pub', 'discussions']).reduce((previous, current, index)=> {
			if (current.get('id') === action.pubId) { return index; }
			return previous;
		}, undefined); 
		const postPubLabelPath = state.getIn(['pub', 'id']) === action.pubId ? ['pub', 'labels'] : ['pub', 'discussions', postPubLabelDiscussionIndex, 'labels'];
		return state.setIn(
			postPubLabelPath, 
			state.getIn(postPubLabelPath).push(ensureImmutable(action.result))
		);
	case POST_PUB_LABEL_FAIL:
		return state;

	case DELETE_PUB_LABEL_LOAD:
		return state;	
	case DELETE_PUB_LABEL_SUCCESS:
		// Set path based on if we are removing a label from a discussion or from the pub
		const deletePubLabelDiscussionIndex = state.getIn(['pub', 'discussions']).reduce((previous, current, index)=> {
			if (current.get('id') === action.pubId) { return index; }
			return previous;
		}, undefined); 
		const deletePubLabelPath = state.getIn(['pub', 'id']) === action.pubId ? ['pub', 'labels'] : ['pub', 'discussions', deletePubLabelDiscussionIndex, 'labels'];
		return state.setIn(
			deletePubLabelPath, 
			state.getIn(deletePubLabelPath).filter((label)=> {
				return label.get('id') !== action.labelId;
			})
		);
	case DELETE_PUB_LABEL_FAIL:
		return state;

	case POST_LABEL_LOAD:
		return state;	
	case POST_LABEL_SUCCESS:
		return state.setIn(
			['pub', 'pubLabels'], 
			state.getIn(['pub', 'pubLabels']).push(ensureImmutable(action.result))
		);
	case POST_LABEL_FAIL:
		return state;

	case PUT_LABEL_LOAD:
		return state;	
	case PUT_LABEL_SUCCESS:
		return state.setIn(
			// Update all of the pubLabels associated with a pub. Labels owned by the pub.
			['pub', 'pubLabels'], 
			state.getIn(['pub', 'pubLabels']).map((label)=> {
				if (label.get('id') === action.labelId) {
					return label.merge({ title: action.title, color: action.color });
				}
				return label;
			})
		).setIn(
			// Update all of the labels associated with discussions. Labels applied to a discussion.
			['pub', 'discussions'],
			state.getIn(['pub', 'discussions']).map((discussion)=> {
				return discussion.setIn(
					['labels'], 
					discussion.get('labels').map((label)=> {
						if (label.get('id') === action.labelId) {
							return label.merge({ title: action.title, color: action.color });
						}
						return label;
					})
				);
			})
		);
	case PUT_LABEL_FAIL:
		return state;

	case DELETE_LABEL_LOAD:
		return state;	
	case DELETE_LABEL_SUCCESS:
		return state.setIn(
			// Update all of the pubLabels associated with a pub. Labels owned by the pub.
			['pub', 'pubLabels'], 
			state.getIn(['pub', 'pubLabels']).filter((label)=> {
				return label.get('id') !== action.labelId;
			})
		).setIn(
			// Update all of the labels associated with discussions. Labels applied to a discussion.
			['pub', 'discussions'],
			state.getIn(['pub', 'discussions']).map((discussion)=> {
				return discussion.setIn(
					['labels'], 
					discussion.get('labels').filter((label)=> {
						return label.get('id') !== action.labelId;
					})
				);
			})
		);
	case DELETE_LABEL_FAIL:
		return state;

	case PUT_DEFAULT_FILE_LOAD:
		return state.setIn(
			['pub', 'versions'], 
			state.getIn(['pub', 'versions']).map((version)=> {
				if (version.get('id') === action.versionId) {
					return version.set('defaultFile', action.defaultFile);
				}
				return version;
			})
		);	
	case PUT_DEFAULT_FILE_SUCCESS:
	case PUT_DEFAULT_FILE_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
