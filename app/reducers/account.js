import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SIGN_UP_DATA_LOAD,
	GET_SIGN_UP_DATA_SUCCESS,
	GET_SIGN_UP_DATA_FAIL,

	CREATE_ACCOUNT_LOAD,
	CREATE_ACCOUNT_SUCCESS,
	CREATE_ACCOUNT_FAIL,

} from 'containers/CreateAccount/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loading: false,
	error: undefined,
	user: {},
	createAccountLoading: false,
	createAccountError: undefined,
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case GET_SIGN_UP_DATA_LOAD:
		return state.merge({
			loading: true,
			error: undefined,
		});	
	case GET_SIGN_UP_DATA_SUCCESS:
		return state.merge({
			loading: false,
			user: {
				email: action.result.email
			}
		});
	case GET_SIGN_UP_DATA_FAIL:
		return state.merge({
			loading: false,
			error: true,
		});

	case CREATE_ACCOUNT_LOAD:
		return state.merge({
			createAccountLoading: true,
			createAccountError: undefined,
		});	
	case CREATE_ACCOUNT_SUCCESS:
		return state.merge({
			createAccountLoading: false,
			createAccountError: undefined,
			user: action.result,
		});
	case CREATE_ACCOUNT_FAIL:
		return state.merge({
			createAccountLoading: false,
			createAccountError: action.error,
		});

	default:
		return ensureImmutable(state);
	}
}
