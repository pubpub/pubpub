/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_ACTIVE_COMMUNITIES_LOAD,
	GET_ACTIVE_COMMUNITIES_SUCCESS,
	GET_ACTIVE_COMMUNITIES_FAIL,

	GET_ALL_COMMUNITIES_LOAD,
	GET_ALL_COMMUNITIES_SUCCESS,
	GET_ALL_COMMUNITIES_FAIL,
} from 'actions/explore';

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
	case GET_ACTIVE_COMMUNITIES_LOAD:
		return {
			data: state.data,
			isLoading: true,
			error: undefined
		};
	case GET_ACTIVE_COMMUNITIES_SUCCESS:
		return {
			data: {
				...state.data,
				activeCommunities: action.result,
			},
			isLoading: false,
			error: undefined,
		};
	case GET_ACTIVE_COMMUNITIES_FAIL:
		return {
			data: state.data,
			isLoading: false,
			error: action.error,
		};
	case GET_ALL_COMMUNITIES_LOAD:
		return {
			data: state.data,
			isLoading: true,
			error: undefined
		};
	case GET_ALL_COMMUNITIES_SUCCESS:
		return {
			data: {
				...state.data,
				allCommunities: action.result,
			},
			isLoading: false,
			error: undefined,
		};
	case GET_ALL_COMMUNITIES_FAIL:
		return {
			data: state.data,
			isLoading: false,
			error: action.error,
		};
	default:
		return state;
	}
}
