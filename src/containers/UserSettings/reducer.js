import Immutable from 'immutable';
import {ensureImmutable} from 'reducers';

/*--------*/
// Load Actions
/*--------*/
import {
	SAVE_SETTINGS_LOAD,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAIL,

} from './actions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	loading: false,
	error: undefined
});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/
function saveSettingsLoad(state) {
	return state.set('loading', true);
}

function saveSettingsSuccess(state, result) {

	return state.merge({
		loading: false,
		error: undefined,
	});
}

function saveSettingsFail(state, error) {
	return state.merge({
		loading: false,
		error: error,
	});
}


/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function profileReducer(state = defaultState, action) {

	switch (action.type) {
	case SAVE_SETTINGS_LOAD:
		return saveSettingsLoad(state);
	case SAVE_SETTINGS_SUCCESS:
		return saveSettingsSuccess(state, action.result);
	case SAVE_SETTINGS_FAIL:
		return saveSettingsFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}
