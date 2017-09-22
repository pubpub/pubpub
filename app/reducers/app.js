/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_APP_DATA_LOAD,
	GET_APP_DATA_SUCCESS,
	GET_APP_DATA_FAIL,

	PUT_APP_DATA_LOAD,
	PUT_APP_DATA_SUCCESS,
	PUT_APP_DATA_FAIL,
} from 'actions/app';

import {
	POST_COLLECTION_LOAD,
	POST_COLLECTION_SUCCESS,
	POST_COLLECTION_FAIL,
} from 'actions/collection';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
	putIsLoading: false,
	putError: undefined,
	postCollectionIsLoading: false,
	postCollectionError: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_APP_DATA_LOAD:
		return {
			data: undefined,
			loading: true,
			error: undefined,
		};
	case GET_APP_DATA_SUCCESS:
		return {
			data: {
				...action.result,
				userData: undefined,
			},
			loading: false,
			error: undefined,
		};
	case GET_APP_DATA_FAIL:
		return {
			data: undefined,
			loading: false,
			error: action.err,
		};
	/* PUT App Data */
	case PUT_APP_DATA_LOAD:
		return {
			...state,
			putIsLoading: true,
			putError: undefined,
		};
	case PUT_APP_DATA_SUCCESS:
		return {
			data: {
				...state.data,
				...action.result,
			},
			putIsLoading: false,
			putError: undefined,
		};
	case PUT_APP_DATA_FAIL:
		return {
			...state,
			putIsLoading: false,
			putError: action.error,
		};
	/* POST Collection*/
	case POST_COLLECTION_LOAD:
		return {
			...state,
			postCollectionIsLoading: true,
		};
	case POST_COLLECTION_SUCCESS:
		return {
			data: {
				...state.data,
				navigation: action.result.navigation,
				collections: [
					...state.data.collections,
					action.result.collection,
				]
			},
			postCollectionIsLoading: false,
			postCollectionError: undefined
		};
	case POST_COLLECTION_FAIL:
		return {
			...state,
			postCollectionIsLoading: false,
			postCollectionError: action.error
		};
	default:
		return state;
	}
}
