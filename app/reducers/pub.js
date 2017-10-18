/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_PUB_DATA_LOAD,
	GET_PUB_DATA_SUCCESS,
	GET_PUB_DATA_FAIL,

	PUT_PUB_DATA_LOAD,
	PUT_PUB_DATA_SUCCESS,
	PUT_PUB_DATA_FAIL,

	DELETE_PUB_LOAD,
	DELETE_PUB_SUCCESS,
	DELETE_PUB_FAIL,

	POST_DISCUSSION_LOAD,
	POST_DISCUSSION_SUCCESS,
	POST_DISCUSSION_FAIL,

	PUT_DISCUSSION_LOAD,
	PUT_DISCUSSION_SUCCESS,
	PUT_DISCUSSION_FAIL,

	POST_COLLABORATOR_LOAD,
	POST_COLLABORATOR_SUCCESS,
	POST_COLLABORATOR_FAIL,

	PUT_COLLABORATOR_LOAD,
	PUT_COLLABORATOR_SUCCESS,
	PUT_COLLABORATOR_FAIL,

	DELETE_COLLABORATOR_LOAD,
	DELETE_COLLABORATOR_SUCCESS,
	DELETE_COLLABORATOR_FAIL,

	POST_VERSION_LOAD,
	POST_VERSION_SUCCESS,
	POST_VERSION_FAIL,

	POST_COLLECTION_PUB_LOAD,
	POST_COLLECTION_PUB_SUCCESS,
	POST_COLLECTION_PUB_FAIL,

	DELETE_COLLECTION_PUB_LOAD,
	DELETE_COLLECTION_PUB_SUCCESS,
	DELETE_COLLECTION_PUB_FAIL,
} from 'actions/pub';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	putPubIsLoading: false,
	deletePubIsLoading: false,
	postDiscussionIsLoading: false,
	postVersionSuccess: false,
	newThreadNumber: undefined,
	postVersionIsLoading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	/* Get Pub Data */
	/* ------------ */
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
	/* Put Pub Data */
	/* ------------ */
	case PUT_PUB_DATA_LOAD:
		return {
			...state,
			putPubIsLoading: true,
		};
	case PUT_PUB_DATA_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				...action.result
			},
			putPubIsLoading: false,
		};
	case PUT_PUB_DATA_FAIL:
		return {
			...state,
			putPubIsLoading: false,
		};
	/* DELETE Pub Data */
	/* ------------ */
	case DELETE_PUB_LOAD:
		return {
			...state,
			deletePubIsLoading: true,
		};
	case DELETE_PUB_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				...action.result
			},
			deletePubIsLoading: false,
		};
	case DELETE_PUB_FAIL:
		return {
			...state,
			deletePubIsLoading: false,
		};
	/* Post Discussion Data */
	/* -------------------- */
	case POST_DISCUSSION_LOAD:
		return {
			...state,
			postDiscussionIsLoading: true,
		};
	case POST_DISCUSSION_SUCCESS:
		return {
			...state,
			postDiscussionIsLoading: false,
			newThreadNumber: action.result.threadNumber,
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
	/* Put Discussion Data */
	/* -------------------- */
	case PUT_DISCUSSION_LOAD:
		return state;
	case PUT_DISCUSSION_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				discussions: state.data.discussions.map((item)=> {
					if (item.id !== action.result.id) { return item; }
					return {
						...item,
						...action.result,
					}
				})
			}
		};
	case PUT_DISCUSSION_FAIL:
		return state;
	/* POST Collaborator Data */
	/* -------------------- */
	case POST_COLLABORATOR_LOAD:
		return state;
	case POST_COLLABORATOR_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				collaborators: [
					...state.data.collaborators,
					action.result,
				]
			}
		};
	case POST_COLLABORATOR_FAIL:
		return state;
	/* PUT Collaborator Data */
	/* -------------------- */
	case PUT_COLLABORATOR_LOAD:
		return state;
	case PUT_COLLABORATOR_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				collaborators: state.data.collaborators.map((item)=> {
					if (item.Collaborator.id === action.result.Collaborator.id) {
						return {
							...item,
							fullName: action.result.fullName || item.fullName,
							Collaborator: {
								...item.Collaborator,
								...action.result.Collaborator,
							}
						};
					}
					return item;
				})
			}
		};
	case PUT_COLLABORATOR_FAIL:
		return state;
	/* DELETE Collaborator Data */
	/* -------------------- */
	case DELETE_COLLABORATOR_LOAD:
		return state;
	case DELETE_COLLABORATOR_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				collaborators: state.data.collaborators.filter((item)=> {
					return item.Collaborator.id !== action.result;
				})
			}
		};
	case DELETE_COLLABORATOR_FAIL:
		return state;
	/* POST Version Data */
	/* -------------------- */
	case POST_VERSION_LOAD:
		return {
			...state,
			postVersionIsLoading: true,
			postVersionSuccess: false,
		};
	case POST_VERSION_SUCCESS:
		return {
			...state,
			postVersionIsLoading: false,
			postVersionSuccess: true,
		};
	case POST_VERSION_FAIL:
		return {
			...state,
			postVersionIsLoading: false,
			postVersionSuccess: false,
		};
	/* POST CollectionPub Data */
	/* -------------------- */
	case POST_COLLECTION_PUB_LOAD:
		return state;
	case POST_COLLECTION_PUB_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				collections: [
					...state.data.collections,
					action.result,
				]
			}
		};
	case POST_COLLECTION_PUB_FAIL:
		return state;
	/* DELETE CollectionPub Data */
	/* -------------------- */
	case DELETE_COLLECTION_PUB_LOAD:
		return state;
	case DELETE_COLLECTION_PUB_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				collections: state.data.collections.filter((item)=> {
					return item.id !== action.result;
				})
			}
		};
	case DELETE_COLLECTION_PUB_FAIL:
		return state;
	default:
		return state;
	}
}
