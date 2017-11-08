/* ---------- */
// Load Actions
/* ---------- */
import {
	POST_COMMUNITY_LOAD,
	POST_COMMUNITY_SUCCESS,
	POST_COMMUNITY_FAIL,
} from 'actions/communityCreate';

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
	case POST_COMMUNITY_LOAD:
		return {
			data: state.data,
			isLoading: true,
			error: undefined
		};
	case POST_COMMUNITY_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case POST_COMMUNITY_FAIL:
		return {
			data: state.data,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
