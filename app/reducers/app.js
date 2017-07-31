/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_APP_DATA_LOAD,
	GET_APP_DATA_SUCCESS,
	GET_APP_DATA_FAIL,
} from 'actions/app';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	title: undefined,
	description: undefined
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_APP_DATA_LOAD:
		return {
			title: undefined,
		};
	case GET_APP_DATA_SUCCESS:
		return action.result;
	case GET_APP_DATA_FAIL:
		return {
			title: 'Error',
		};
	default:
		return state;
	}
}
