import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_DATA_LOAD,
	GET_PUB_DATA_SUCCESS,
	GET_PUB_DATA_FAIL,
} from 'containers/Pub/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
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
			error: false,
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

	default:
		return ensureImmutable(state);
	}
}
