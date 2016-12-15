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

	default:
		return ensureImmutable(state);
	}
}
