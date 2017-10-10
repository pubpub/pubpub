/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_COLLECTION_DATA_LOAD,
	GET_COLLECTION_DATA_SUCCESS,
	GET_COLLECTION_DATA_FAIL,

	PUT_COLLECTION_LOAD,
	PUT_COLLECTION_SUCCESS,
	PUT_COLLECTION_FAIL,

	DELETE_COLLECTION_LOAD,
	DELETE_COLLECTION_SUCCESS,
	DELETE_COLLECTION_FAIL,
} from 'actions/collection';

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
	case GET_COLLECTION_DATA_LOAD:
		return {
			data: undefined,
			isLoading: true,
			error: undefined
		};
	case GET_COLLECTION_DATA_SUCCESS:
		return {
			data: action.result,
			isLoading: false,
			error: undefined,
		};
	case GET_COLLECTION_DATA_FAIL:
		return {
			data: undefined,
			isLoading: false,
			error: action.error,
		};
	case PUT_COLLECTION_LOAD:
		return state;
	case PUT_COLLECTION_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				...action.result,
			}
		};
	case PUT_COLLECTION_FAIL:
		return state;
	case DELETE_COLLECTION_LOAD:
		return state;
	case DELETE_COLLECTION_SUCCESS:
		return state;
	case DELETE_COLLECTION_FAIL:
		return state;
	default:
		return state;
	}
}
