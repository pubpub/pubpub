import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_APP_DATA_LOAD = 'app/GET_APP_DATA_LOAD';
export const GET_APP_DATA_SUCCESS = 'app/GET_APP_DATA_SUCCESS';
export const GET_APP_DATA_FAIL = 'app/GET_APP_DATA_FAIL';

export const PUT_APP_DATA_LOAD = 'app/PUT_APP_DATA_LOAD';
export const PUT_APP_DATA_SUCCESS = 'app/PUT_APP_DATA_SUCCESS';
export const PUT_APP_DATA_FAIL = 'app/PUT_APP_DATA_FAIL';

export const POST_COMMUNITY_ADMIN_LOAD = 'app/POST_COMMUNITY_ADMIN_LOAD';
export const POST_COMMUNITY_ADMIN_SUCCESS = 'app/POST_COMMUNITY_ADMIN_SUCCESS';
export const POST_COMMUNITY_ADMIN_FAIL = 'app/POST_COMMUNITY_ADMIN_FAIL';

export const DELETE_COMMUNITY_ADMIN_LOAD = 'app/DELETE_COMMUNITY_ADMIN_LOAD';
export const DELETE_COMMUNITY_ADMIN_SUCCESS = 'app/DELETE_COMMUNITY_ADMIN_SUCCESS';
export const DELETE_COMMUNITY_ADMIN_FAIL = 'app/DELETE_COMMUNITY_ADMIN_FAIL';
/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getAppData(hostname) {
	return (dispatch) => {
		dispatch({ type: GET_APP_DATA_LOAD });
		return apiFetch(`/communities/${hostname}`)
		.then((result) => {
			dispatch({ type: GET_APP_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_APP_DATA_FAIL, error });
		});
	};
}

export function putAppData({ communityId, title, subdomain, description, avatar, favicon, smallHeaderLogo, largeHeaderLogo, largeHeaderBackground, accentColor, navigation }) {
	return (dispatch) => {
		dispatch({ type: PUT_APP_DATA_LOAD });
		return apiFetch('/communities', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				communityId,
				title,
				subdomain,
				description,
				avatar,
				favicon,
				smallHeaderLogo,
				largeHeaderLogo,
				largeHeaderBackground,
				accentColor,
				navigation,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_APP_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: PUT_APP_DATA_FAIL, error });
		});
	};
}

export function postCommunityAdmin({ userId, communityId }) {
	return (dispatch) => {
		dispatch({ type: POST_COMMUNITY_ADMIN_LOAD });
		return apiFetch('/communityAdmins', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId,
				communityId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_COMMUNITY_ADMIN_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_COMMUNITY_ADMIN_FAIL, error });
		});
	};
}

export function deleteCommunityAdmin({ userId, communityId }) {
	return (dispatch) => {
		dispatch({ type: DELETE_COMMUNITY_ADMIN_LOAD });
		return apiFetch('/communityAdmins', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId,
				communityId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_COMMUNITY_ADMIN_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: DELETE_COMMUNITY_ADMIN_FAIL, error });
		});
	};
}
