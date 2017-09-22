import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_PUB_DATA_LOAD = 'pub/GET_PUB_DATA_LOAD';
export const GET_PUB_DATA_SUCCESS = 'pub/GET_PUB_DATA_SUCCESS';
export const GET_PUB_DATA_FAIL = 'pub/GET_PUB_DATA_FAIL';

export const PUT_PUB_DATA_LOAD = 'pub/PUT_PUB_DATA_LOAD';
export const PUT_PUB_DATA_SUCCESS = 'pub/PUT_PUB_DATA_SUCCESS';
export const PUT_PUB_DATA_FAIL = 'pub/PUT_PUB_DATA_FAIL';

export const POST_DISCUSSION_LOAD = 'pub/POST_DISCUSSION_LOAD';
export const POST_DISCUSSION_SUCCESS = 'pub/POST_DISCUSSION_SUCCESS';
export const POST_DISCUSSION_FAIL = 'pub/POST_DISCUSSION_FAIL';

export const POST_COLLABORATOR_LOAD = 'pub/POST_COLLABORATOR_LOAD';
export const POST_COLLABORATOR_SUCCESS = 'pub/POST_COLLABORATOR_SUCCESS';
export const POST_COLLABORATOR_FAIL = 'pub/POST_COLLABORATOR_FAIL';

export const PUT_COLLABORATOR_LOAD = 'pub/PUT_COLLABORATOR_LOAD';
export const PUT_COLLABORATOR_SUCCESS = 'pub/PUT_COLLABORATOR_SUCCESS';
export const PUT_COLLABORATOR_FAIL = 'pub/PUT_COLLABORATOR_FAIL';

export const DELETE_COLLABORATOR_LOAD = 'pub/DELETE_COLLABORATOR_LOAD';
export const DELETE_COLLABORATOR_SUCCESS = 'pub/DELETE_COLLABORATOR_SUCCESS';
export const DELETE_COLLABORATOR_FAIL = 'pub/DELETE_COLLABORATOR_FAIL';

export const POST_VERSION_LOAD = 'pub/POST_VERSION_LOAD';
export const POST_VERSION_SUCCESS = 'pub/POST_VERSION_SUCCESS';
export const POST_VERSION_FAIL = 'pub/POST_VERSION_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPubData(slug) {
	return (dispatch) => {
		dispatch({ type: GET_PUB_DATA_LOAD });
		return apiFetch(`/pubs/${slug}`)
		.then((result) => {
			dispatch({ type: GET_PUB_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_PUB_DATA_FAIL, error });
		});
	};
}

export function putPubData({ pubId, title, slug, description, avatar, useHeaderImage }) {
	return (dispatch) => {
		dispatch({ type: PUT_PUB_DATA_LOAD });
		return apiFetch('/pubs', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				title: title,
				slug: slug,
				description: description,
				avatar: avatar,
				useHeaderImage: useHeaderImage,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_PUB_DATA_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: PUT_PUB_DATA_FAIL, error });
		});
	};
}

export function postDiscussion({ title, content, text, userId, pubId, communityId, threadNumber }) {
	return (dispatch) => {
		dispatch({ type: POST_DISCUSSION_LOAD });
		return apiFetch('/discussions', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				content: content,
				text: text,
				userId: userId,
				pubId: pubId,
				communityId: communityId,
				threadNumber: threadNumber,
			})
		})
		.then((result) => {
			dispatch({ type: POST_DISCUSSION_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_DISCUSSION_FAIL, error });
		});
	};
}

export function postCollaborator({ pubId, userId, name, order }) {
	return (dispatch) => {
		dispatch({ type: POST_COLLABORATOR_LOAD });
		return apiFetch('/collaborators', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId,
				userId,
				name,
				order,
			})
		})
		.then((result) => {
			dispatch({ type: POST_COLLABORATOR_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_COLLABORATOR_FAIL, error });
		});
	};
}

export function putCollaborator({ collaboratorId, pubId, isAuthor, permissions, name, order }) {
	return (dispatch) => {
		dispatch({ type: PUT_COLLABORATOR_LOAD });
		return apiFetch('/collaborators', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				collaboratorId,
				pubId,
				isAuthor,
				permissions,
				name,
				order,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_COLLABORATOR_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: PUT_COLLABORATOR_FAIL, error });
		});
	};
}

export function deleteCollaborator({ collaboratorId, pubId }) {
	return (dispatch) => {
		dispatch({ type: DELETE_COLLABORATOR_LOAD });
		return apiFetch('/collaborators', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				collaboratorId,
				pubId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_COLLABORATOR_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: DELETE_COLLABORATOR_FAIL, error });
		});
	};
}

export function postVersion({ pubId, content }) {
	return (dispatch) => {
		dispatch({ type: POST_VERSION_LOAD });
		return apiFetch('/versions', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId,
				content,
			})
		})
		.then((result) => {
			dispatch({ type: POST_VERSION_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_VERSION_FAIL, error });
		});
	};
}
