/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_DATA_LOAD,
	GET_PUB_DATA_SUCCESS,
	GET_PUB_DATA_FAIL,
} from 'actions/pub';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: undefined,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_PUB_DATA_LOAD:
		return {
			isLoading: true,
			error: undefined
		};
	case GET_PUB_DATA_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_PUB_DATA_FAIL:
		return {
			isLoading: false,
			error: 'Error',
		};
	default:
		return state;
	}
}
