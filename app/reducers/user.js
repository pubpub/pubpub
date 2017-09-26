/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_USER_DATA_LOAD,
	GET_USER_DATA_SUCCESS,
	GET_USER_DATA_FAIL,

	PUT_USER_DATA_LOAD,
	PUT_USER_DATA_SUCCESS,
	PUT_USER_DATA_FAIL,
} from 'actions/user';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
	putUserIsLoading: false,
	putUserError: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_USER_DATA_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined
		};
	case GET_USER_DATA_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_USER_DATA_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: action.error,
		};
	/* PUT User Data */
	/* ------------ */
	case PUT_USER_DATA_LOAD:
		return {
			...state,
			putUserIsLoading: true,
		};
	case PUT_USER_DATA_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				...action.result
			},
			putUserIsLoading: false,
		};
	case PUT_USER_DATA_FAIL:
		return {
			...state,
			putUserIsLoading: false,
			putUserError: action.error
		};
	default:
		return state;
	}
}
