import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,
} from 'containers/CreatePub/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	newJournalSlug: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {

	case CREATE_JOURNAL_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case CREATE_JOURNAL_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			newPubSlug: action.slug,
		});
	case CREATE_JOURNAL_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
