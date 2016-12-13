import Immutable from 'immutable';
import { ensureImmutable } from './index';

/* ---------- */
// Load Actions
/* ---------- */
import {
	LOGIN_GET_LOAD,
	LOGIN_GET_SUCCESS,
	LOGIN_GET_FAIL,

	GET_PUB_LOAD,
	GET_PUB_SUCCESS,
	GET_PUB_FAIL,

	POST_USER_LOAD,
	POST_USER_SUCCESS,
	POST_USER_FAIL,

	POST_DISCUSSION_LOAD,
	POST_DISCUSSION_SUCCESS,
	POST_DISCUSSION_FAIL,

	SET_CLONE_SUCCESS,

	SET_PR_SUCCESS,
	ACCEPT_PR_SUCCESS,
} from 'containers/App/actions';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = Immutable.Map({
	loginFinished: false,
	loading: false,
	error: undefined,
	loginData: {},
	recentUsers: [],
	pub: {},
	user: {},
});

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	
	case LOGIN_GET_SUCCESS:
	case LOGIN_GET_FAIL:
		return state.set('loginFinished', true);

	case GET_PUB_SUCCESS:
		return {
			...state,
			pub: action.result,
		};
	case POST_DISCUSSION_SUCCESS:
		return {
			...state,
			pub: {
				...state.pub,
				discussions: [
					...state.pub.discussions,
					action.result
				],
			}
		};
	case POST_USER_SUCCESS:
		return {
			...state,
			user: action.result
		};
	case SET_CLONE_SUCCESS:
		return {
			...state,
			pub: {
				...state.pub,
				parent: {
					id: action.parentId,
					title: action.parentTitle
				}
			}
		};

	case SET_PR_SUCCESS:
		return {
			...state,
			pub: {
				...state.pub,
				parent: null,
				discussions: [
					...state.pub.discussions,
					action.newPR
				],
			}
		};

	case ACCEPT_PR_SUCCESS:
		return {
			...state,
			pub: {
				...state.pub,
				versions: [
					...state.pub.versions,
					action.newVersion
				],
			}
		};

	default:
		return ensureImmutable(state);
	}
}
