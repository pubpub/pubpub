import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_ACTIVITIES_LOAD,
	GET_ACTIVITIES_SUCCESS,
	GET_ACTIVITIES_FAIL,
} from 'containers/Landing/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	activities: {},
	assets: {},
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_ACTIVITIES_LOAD:
		return state.merge({
			loading: false,
			error: undefined
		});

	case GET_ACTIVITIES_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			activities: action.result.activities,
			assets: action.result.assets
		});

	case GET_ACTIVITIES_FAIL:
		return state.merge({
			loading: false,
			error: action.error
		});

	default:
		return ensureImmutable(state);
	}
}
