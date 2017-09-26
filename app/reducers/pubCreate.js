/* ---------- */
// Load Actions
/* ---------- */
import {
	POST_PUB_LOAD,
	POST_PUB_SUCCESS,
	POST_PUB_FAIL,
} from 'actions/pubCreate';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case POST_PUB_LOAD:
		return {
			data: undefined,
			isLoading: action.collectionId,
			error: undefined,
		};
	case POST_PUB_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_PUB_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
