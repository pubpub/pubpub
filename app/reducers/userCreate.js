/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_SIGNUP_DATA_LOAD,
	GET_SIGNUP_DATA_SUCCESS,
	GET_SIGNUP_DATA_FAIL,

	POST_USER_LOAD,
	POST_USER_SUCCESS,
	POST_USER_FAIL,
} from 'actions/userCreate';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	hashError: undefined,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_SIGNUP_DATA_LOAD:
		return {
			data: undefined,
			isLoading: true,
			hashError: undefined
		};
	case GET_SIGNUP_DATA_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			hashError: undefined,
		};
	case GET_SIGNUP_DATA_FAIL:
		return {
			data: undefined,
			isLoading: false,
			hashError: action.error,
		};
	case POST_USER_LOAD:
		return {
			data: state.data,
			isLoading: true,
			error: undefined
		};
	case POST_USER_SUCCESS:
		return {
			data: {
				...state.data,
				...action.result
			},
			isLoading: false,
			error: undefined,
		};
	case POST_USER_FAIL:
		return {
			data: state.data,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
