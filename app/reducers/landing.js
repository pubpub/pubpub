import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_LANDING_FEATURES_LOAD,
	GET_LANDING_FEATURES_SUCCESS,
	GET_LANDING_FEATURES_FAIL,
} from 'containers/Landing/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: true,
	error: undefined,
	pubs: [],
	journals: [],
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_LANDING_FEATURES_LOAD:
		return state.merge({
			loading: true,
			error: undefined
		});

	case GET_LANDING_FEATURES_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			pubs: action.result.pubs,
			journals: action.result.journals
		});

	case GET_LANDING_FEATURES_FAIL:
		return state.merge({
			loading: false,
			error: action.error
		});

	default:
		return ensureImmutable(state);
	}
}
