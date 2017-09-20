/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_DATA_LOAD,
	GET_PUB_DATA_SUCCESS,
	GET_PUB_DATA_FAIL,

	POST_DISCUSSION_LOAD,
	POST_DISCUSSION_SUCCESS,
	POST_DISCUSSION_FAIL,
} from 'actions/pub';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: undefined,
	postDiscussionIsLoading: undefined,
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
			error: action.error,
		};
	case POST_DISCUSSION_LOAD:
		return {
			...state,
			postDiscussionIsLoading: true,
		};
	case POST_DISCUSSION_SUCCESS:
		return {
			...state,
			postDiscussionIsLoading: false,
			data: {
				...state.data,
				discussions: [
					...state.data.discussions,
					action.result,
				]
			}
		};
	case POST_DISCUSSION_FAIL:
		return {
			...state,
			postDiscussionIsLoading: false,
		};
	default:
		return state;
	}
}
