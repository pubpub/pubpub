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
} from 'containers/Pub/actionsJournals';

import {
	POST_DISCUSSION_LOAD,
	POST_DISCUSSION_SUCCESS,
	POST_DISCUSSION_FAIL,
} from 'containers/Pub/actionsDiscussions';

import {
	POST_REVIEWER_LOAD,
	POST_REVIEWER_SUCCESS,
	POST_REVIEWER_FAIL,
} from 'containers/Pub/actionsReviewers';

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
	reviewersLoading: false,
	reviewersError: undefined,
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

	case POST_REVIEWER_LOAD:
		return state.merge({
			reviewersLoading: true,
			reviewersError: undefined,
		});	
	case POST_REVIEWER_SUCCESS:
		return state.merge({
			reviewersLoading: false,
			reviewersError: undefined,
		})
		.mergeIn(
			['pub', 'invitedReviewers'], 
			state.getIn(['pub', 'invitedReviewers']).push(ensureImmutable(action.result))
		);
	case POST_REVIEWER_FAIL:
		return state.merge({
			reviewersLoading: false,
			reviewersError: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
