/* ---------- */
// Load Actions
/* ---------- */
import {
	POST_PASSWORD_RESET_LOAD,
	POST_PASSWORD_RESET_SUCCESS,
	POST_PASSWORD_RESET_FAIL,

	GET_PASSWORD_RESET_LOAD,
	GET_PASSWORD_RESET_SUCCESS,
	GET_PASSWORD_RESET_FAIL,

	PUT_PASSWORD_RESET_LOAD,
	PUT_PASSWORD_RESET_SUCCESS,
	PUT_PASSWORD_RESET_FAIL,
} from 'actions/passwordReset';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	getIsLoading: false,
	getError: undefined,
	postIsLoading: false,
	postError: undefined,
	putIsLoading: false,
	putError: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case POST_PASSWORD_RESET_LOAD:
		return {
			...state,
			postIsLoading: true,
			postError: undefined,
		};
	case POST_PASSWORD_RESET_SUCCESS:
		return {
			...state,
			postIsLoading: false,
			postError: undefined,
		};
	case POST_PASSWORD_RESET_FAIL:
		return {
			...state,
			postIsLoading: false,
			postError: action.error,
		};

	case PUT_PASSWORD_RESET_LOAD:
		return {
			...state,
			putIsLoading: true,
			putError: undefined,
		};
	case PUT_PASSWORD_RESET_SUCCESS:
		return {
			...state,
			putIsLoading: false,
			putError: undefined,
		};
	case PUT_PASSWORD_RESET_FAIL:
		return {
			...state,
			putIsLoading: false,
			putError: true,
		};

	case GET_PASSWORD_RESET_LOAD:
		return {
			...state,
			getIsLoading: true,
			getError: undefined,
		};
	case GET_PASSWORD_RESET_SUCCESS:
		return {
			...state,
			getIsLoading: false,
			getError: undefined,
		};
	case GET_PASSWORD_RESET_FAIL:
		return {
			...state,
			getIsLoading: false,
			getError: true,
		};
	default:
		return state;
	}
}
