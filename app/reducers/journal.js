import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_JOURNAL_DATA_LOAD,
	GET_JOURNAL_DATA_SUCCESS,
	GET_JOURNAL_DATA_FAIL,

	PUT_JOURNAL_DATA_LOAD,
	PUT_JOURNAL_DATA_SUCCESS,
	PUT_JOURNAL_DATA_FAIL,
} from 'containers/Journal/actions';

import {
	PUT_JOURNAL_SUBMIT_LOAD,
	PUT_JOURNAL_SUBMIT_SUCCESS,
	PUT_JOURNAL_SUBMIT_FAIL,

	POST_JOURNAL_FEATURE_LOAD,
	POST_JOURNAL_FEATURE_SUCCESS,
	POST_JOURNAL_FEATURE_FAIL,
} from 'containers/Journal/actionsSubmits';

import {
	POST_JOURNAL_ADMIN_LOAD,
	POST_JOURNAL_ADMIN_SUCCESS,
	POST_JOURNAL_ADMIN_FAIL,

	DELETE_JOURNAL_ADMIN_LOAD,
	DELETE_JOURNAL_ADMIN_SUCCESS,
	DELETE_JOURNAL_ADMIN_FAIL,
} from 'containers/Journal/actionsAdmins';

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
} from 'containers/Journal/actionsLabels';

import {
	POST_PUB_LABEL_LOAD,
	POST_PUB_LABEL_SUCCESS,
	POST_PUB_LABEL_FAIL,

	DELETE_PUB_LABEL_LOAD,
	DELETE_PUB_LABEL_SUCCESS,
	DELETE_PUB_LABEL_FAIL,
} from 'containers/Journal/actionsPubLabels';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	journal: {},
	putDataLoading: false,
	putDataError: undefined,
	submitsLoading: false,
	submitsError: undefined,
	adminsLoading: false,
	adminsError: undefined,
	pagesLoading: false,
	pagesError: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_JOURNAL_DATA_LOAD:
		return state.merge({
			loading: true,
			error: false,
			journal: {},
		});	
	case GET_JOURNAL_DATA_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			journal: action.result
		});
	case GET_JOURNAL_DATA_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
			journal: null,
		});

	case PUT_JOURNAL_DATA_LOAD:
		return state.merge({
			putDataLoading: true,
			putDataError: undefined,
		});	
	case PUT_JOURNAL_DATA_SUCCESS:
		return state.merge({
			putDataLoading: false,
			putDataError: undefined,
		})
		.mergeIn(
			['journal'],
			action.newJournalData
		);
	case PUT_JOURNAL_DATA_FAIL:
		return state.merge({
			putDataLoading: false,
			putDataError: action.error,
			// journal: null,
		});

	case PUT_JOURNAL_SUBMIT_LOAD:
		return state.merge({
			submitsLoading: true,
			submitsError: undefined,
		});	
	case PUT_JOURNAL_SUBMIT_SUCCESS:
		return state.merge({
			submitsLoading: false,
			submitsError: undefined,
		})
		.setIn(
			['journal', 'pubSubmits'],
			state.getIn(['journal', 'pubSubmits']).map((pubSubmit)=> {
				if (pubSubmit.get('pubId') === action.pubId) {
					const newSubmit = { ...pubSubmit.toJS() };
					newSubmit.isRejected = true;
					newSubmit.updatedAt = new Date();
					return ensureImmutable(newSubmit);
				}
				return pubSubmit;
			})
		);
	case PUT_JOURNAL_SUBMIT_FAIL:
		return state.merge({
			submitsLoading: false,
			submitsError: action.error,
		});

	case POST_JOURNAL_FEATURE_LOAD:
		return state.merge({
			submitsLoading: true,
			submitsError: undefined,
		});	
	case POST_JOURNAL_FEATURE_SUCCESS:
		return state.merge({
			submitsLoading: false,
			submitsError: undefined,
		})
		.setIn(
			['journal', 'pubSubmits'],
			state.getIn(['journal', 'pubSubmits']).map((pubSubmit)=> {
				if (pubSubmit.get('pubId') === action.pubId) {
					const newSubmit = { ...pubSubmit.toJS() };
					newSubmit.isFeatured = true;
					newSubmit.updatedAt = new Date();
					return ensureImmutable(newSubmit);
				}
				return pubSubmit;
			})
		)
		.setIn(
			['journal', 'pubFeatures'],
			state.getIn(['journal', 'pubFeatures']).push(ensureImmutable(action.result))
		);
	case POST_JOURNAL_FEATURE_FAIL:
		return state.merge({
			submitsLoading: false,
			submitsError: action.error,
		});

	case POST_JOURNAL_ADMIN_LOAD:
		return state.merge({
			adminsLoading: true,
			adminsError: undefined,
		});	
	case POST_JOURNAL_ADMIN_SUCCESS:
		return state.merge({
			adminsLoading: false,
			adminsError: undefined,
		})
		.mergeIn(
			['journal', 'admins'], 
			state.getIn(['journal', 'admins']).unshift(ensureImmutable(action.result))
		);
	case POST_JOURNAL_ADMIN_FAIL:
		return state.merge({
			adminsLoading: false,
			adminsError: action.error,
		});

	case DELETE_JOURNAL_ADMIN_LOAD:
		return state.merge({
			adminsLoading: true,
			adminsError: undefined,
		});	
	case DELETE_JOURNAL_ADMIN_SUCCESS:
		return state.merge({
			adminsLoading: false,
			adminsError: undefined,
		})
		.setIn(
			['journal', 'admins'], 
			state.getIn(['journal', 'admins']).filter((admin)=> {
				return admin.get('id') !== action.journalAdminId;
			})
		);
	case DELETE_JOURNAL_ADMIN_FAIL:
		return state.merge({
			adminsLoading: false,
			adminsError: action.error,
		});

	case POST_LABEL_LOAD:
		return state.merge({
			pagesLoading: true,
			pagesError: undefined,
		});	
	case POST_LABEL_SUCCESS:
		return state.merge({
			pagesLoading: false,
			pagesError: undefined,
		}).setIn(
			['journal', 'pages'], 
			state.getIn(['journal', 'pages']).push(ensureImmutable(action.result))
		);
	case POST_LABEL_FAIL:
		return state.merge({
			pagesLoading: false,
			pagesError: action.error,
		});

	case PUT_LABEL_LOAD:
		return state.setIn(
			// Update all of the pages associated with a journal. Labels owned by the journal.
			['journal', 'pages'], 
			state.getIn(['journal', 'pages']).map((label)=> {
				if (label.get('id') === action.labelId) {
					return label.merge(action.labelUpdates);
				}
				return label;
			})
		).setIn(
			// Update all of the labels associated with discussions. Labels applied to a discussion.
			['journal', 'pubFeatures'],
			state.getIn(['journal', 'pubFeatures']).map((pubFeature)=> {
				const pubLabels = pubFeature.getIn(['pub', 'labels']);
				if (!pubLabels) { return pubFeature; }
				return pubFeature.setIn(
					['pub', 'labels'], 
					pubLabels.map((label)=> {
						if (label.get('id') === action.labelId) {
							return label.merge(action.labelUpdates);
						}
						return label;
					})
				);
			})
		);
	case PUT_LABEL_SUCCESS:
	case PUT_LABEL_FAIL:
		return state;

	case DELETE_LABEL_LOAD:
		return state.merge({
			pagesLoading: true,
			pagesError: undefined,
		});	
	case DELETE_LABEL_SUCCESS:
		return state.merge({
			pagesLoading: false,
			pagesError: undefined,
		}).setIn(
			// Update all of the pages associated with a journal. 
			['journal', 'pages'], 
			state.getIn(['journal', 'pages']).filter((label)=> {
				return label.get('id') !== action.labelId;
			})
		).setIn(
			// Update all of the pages associated with featured pubs. Labels applied to a featured pub.
			['journal', 'pubFeatures'],
			state.getIn(['journal', 'pubFeatures']).map((pubFeature)=> {
				const pubLabels = pubFeature.getIn(['pub', 'labels']);
				if (!pubLabels) { return pubFeature; }
				return pubFeature.setIn(
					['pub', 'labels'], 
					pubLabels.filter((label)=> {
						return label.get('id') !== action.labelId;
					})
				);
			})
		);
	case DELETE_LABEL_FAIL:
		return state.merge({
			pagesLoading: false,
			pagesError: action.error,
		});

	case POST_PUB_LABEL_LOAD:
		return state;	
	case POST_PUB_LABEL_SUCCESS:
		// Set path based on if we are adding a label to a discussion or to the pub
		const postPubLabelFeaturedPubIndex = state.getIn(['journal', 'pubFeatures']).reduce((previous, current, index)=> {
			if (current.getIn(['pub', 'id']) === action.pubId) { return index; }
			return previous;
		}, undefined); 
		const postPubLabelPath = ['journal', 'pubFeatures', postPubLabelFeaturedPubIndex, 'pub', 'labels'];
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
		const deletePubLabelFeaturedPubIndex = state.getIn(['journal', 'pubFeatures']).reduce((previous, current, index)=> {
			if (current.getIn(['pub', 'id']) === action.pubId) { return index; }
			return previous;
		}, undefined); 
		const deletePubLabelPath = ['journal', 'pubFeatures', deletePubLabelFeaturedPubIndex, 'pub', 'labels'];
		return state.setIn(
			deletePubLabelPath, 
			state.getIn(deletePubLabelPath).filter((label)=> {
				return label.get('id') !== action.labelId;
			})
		);
	case DELETE_PUB_LABEL_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
