import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	CREATE_PUB_LOAD,
	CREATE_PUB_SUCCESS,
	CREATE_PUB_FAIL,
} from 'containers/CreatePub/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	newPubSlug: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {

	case CREATE_PUB_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case CREATE_PUB_SUCCESS:
		return state.merge({
			loading: false,
			error: undefined,
			newPubSlug: action.slug,
		});
	case CREATE_PUB_FAIL:
		return state.merge({
			loading: false,
			error: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
