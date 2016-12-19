import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_LABEL_LOAD,
	GET_LABEL_SUCCESS,
	GET_LABEL_FAIL,
} from 'containers/Label/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	label: {},
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {

	case GET_LABEL_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case GET_LABEL_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			label: action.result,
		});
	case GET_LABEL_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
