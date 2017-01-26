/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_DISCUSSION_LOAD = 'pub/POST_DISCUSSION_LOAD';
export const POST_DISCUSSION_SUCCESS = 'pub/POST_DISCUSSION_SUCCESS';
export const POST_DISCUSSION_FAIL = 'pub/POST_DISCUSSION_FAIL';

export const PUT_DISCUSSION_LOAD = 'pub/PUT_DISCUSSION_LOAD';
export const PUT_DISCUSSION_SUCCESS = 'pub/PUT_DISCUSSION_SUCCESS';
export const PUT_DISCUSSION_FAIL = 'pub/PUT_DISCUSSION_FAIL';

export const PUT_DISCUSSION_CLOSE_LOAD = 'pub/PUT_DISCUSSION_CLOSE_LOAD';
export const PUT_DISCUSSION_CLOSE_SUCCESS = 'pub/PUT_DISCUSSION_CLOSE_SUCCESS';
export const PUT_DISCUSSION_CLOSE_FAIL = 'pub/PUT_DISCUSSION_CLOSE_FAIL';

export const POST_REACTION_LOAD = 'pub/POST_REACTION_LOAD';
export const POST_REACTION_SUCCESS = 'pub/POST_REACTION_SUCCESS';
export const POST_REACTION_FAIL = 'pub/POST_REACTION_FAIL';

export const DELETE_REACTION_LOAD = 'pub/DELETE_REACTION_LOAD';
export const DELETE_REACTION_SUCCESS = 'pub/DELETE_REACTION_SUCCESS';
export const DELETE_REACTION_FAIL = 'pub/DELETE_REACTION_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postDiscussion(replyRootPubId, replyParentPubId, title, description, labels, isPrivate) {
	return (dispatch) => {
		dispatch({ type: POST_DISCUSSION_LOAD });

		return clientFetch('/api/pub/discussion', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				replyRootPubId: replyRootPubId,
				replyParentPubId: replyParentPubId,
				description: description, 
				labels: labels,
				isPrivate: isPrivate,
				// We are using the description to store the body content for now. This is to avoid creating a version, file, etc.
				// If the need to have more robust content in discussions arises, then we can switch to full pub structure.
			})
		})
		.then((result) => {
			dispatch({ type: POST_DISCUSSION_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_DISCUSSION_FAIL, error });
		});
	};
}

export function putDiscussion(pubId, title, description) {
	return (dispatch) => {
		dispatch({ type: PUT_DISCUSSION_LOAD });

		return clientFetch('/api/pub', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				title: title,
				description: description,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_DISCUSSION_SUCCESS, result, pubId: pubId, title: title, description: description });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_DISCUSSION_FAIL, error });
		});
	};
}

export function toggleCloseDiscussion(pubId, replyRootPubId, isClosed) {
	return (dispatch) => {
		dispatch({ type: PUT_DISCUSSION_CLOSE_LOAD });

		return clientFetch('/api/pub/discussion', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				replyRootPubId: replyRootPubId,
				isClosed: isClosed,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_DISCUSSION_CLOSE_SUCCESS, result, pubId: pubId, replyRootPubId: replyRootPubId, isClosed: isClosed });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_DISCUSSION_CLOSE_FAIL, error });
		});
	};
}

export function postReaction(pubId, replyRootPubId, reactionId) {
	return (dispatch) => {
		dispatch({ type: POST_REACTION_LOAD });

		return clientFetch('/api/pub/reaction', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				replyRootPubId: replyRootPubId,
				reactionId: reactionId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_REACTION_SUCCESS, result, pubId: pubId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_REACTION_FAIL, error });
		});
	};
}

export function deleteReaction(pubId, replyRootPubId, reactionId, accountId) {
	return (dispatch) => {
		dispatch({ type: DELETE_REACTION_LOAD });

		return clientFetch('/api/pub/reaction', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				replyRootPubId: replyRootPubId,
				reactionId: reactionId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_REACTION_SUCCESS, result, pubId: pubId, reactionId: reactionId, accountId: accountId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_REACTION_FAIL, error });
		});
	};
}

