/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
// Pubs
export const POST_FOLLOWS_PUB_LOAD = 'follow/POST_FOLLOWS_PUB_LOAD';
export const POST_FOLLOWS_PUB_SUCCESS = 'follow/POST_FOLLOWS_PUB_SUCCESS';
export const POST_FOLLOWS_PUB_FAIL = 'follow/POST_FOLLOWS_PUB_FAIL';

export const PUT_FOLLOWS_PUB_LOAD = 'follow/PUT_FOLLOWS_PUB_LOAD';
export const PUT_FOLLOWS_PUB_SUCCESS = 'follow/PUT_FOLLOWS_PUB_SUCCESS';
export const PUT_FOLLOWS_PUB_FAIL = 'follow/PUT_FOLLOWS_PUB_FAIL';

export const DELETE_FOLLOWS_PUB_LOAD = 'follow/DELETE_FOLLOWS_PUB_LOAD';
export const DELETE_FOLLOWS_PUB_SUCCESS = 'follow/DELETE_FOLLOWS_PUB_SUCCESS';
export const DELETE_FOLLOWS_PUB_FAIL = 'follow/DELETE_FOLLOWS_PUB_FAIL';

// Users
export const POST_FOLLOWS_USER_LOAD = 'follow/POST_FOLLOWS_USER_LOAD';
export const POST_FOLLOWS_USER_SUCCESS = 'follow/POST_FOLLOWS_USER_SUCCESS';
export const POST_FOLLOWS_USER_FAIL = 'follow/POST_FOLLOWS_USER_FAIL';

export const PUT_FOLLOWS_USER_LOAD = 'follow/PUT_FOLLOWS_USER_LOAD';
export const PUT_FOLLOWS_USER_SUCCESS = 'follow/PUT_FOLLOWS_USER_SUCCESS';
export const PUT_FOLLOWS_USER_FAIL = 'follow/PUT_FOLLOWS_USER_FAIL';

export const DELETE_FOLLOWS_USER_LOAD = 'follow/DELETE_FOLLOWS_USER_LOAD';
export const DELETE_FOLLOWS_USER_SUCCESS = 'follow/DELETE_FOLLOWS_USER_SUCCESS';
export const DELETE_FOLLOWS_USER_FAIL = 'follow/DELETE_FOLLOWS_USER_FAIL';

// Journals
export const POST_FOLLOWS_JOURNAL_LOAD = 'follow/POST_FOLLOWS_JOURNAL_LOAD';
export const POST_FOLLOWS_JOURNAL_SUCCESS = 'follow/POST_FOLLOWS_JOURNAL_SUCCESS';
export const POST_FOLLOWS_JOURNAL_FAIL = 'follow/POST_FOLLOWS_JOURNAL_FAIL';

export const PUT_FOLLOWS_JOURNAL_LOAD = 'follow/PUT_FOLLOWS_JOURNAL_LOAD';
export const PUT_FOLLOWS_JOURNAL_SUCCESS = 'follow/PUT_FOLLOWS_JOURNAL_SUCCESS';
export const PUT_FOLLOWS_JOURNAL_FAIL = 'follow/PUT_FOLLOWS_JOURNAL_FAIL';

export const DELETE_FOLLOWS_JOURNAL_LOAD = 'follow/DELETE_FOLLOWS_JOURNAL_LOAD';
export const DELETE_FOLLOWS_JOURNAL_SUCCESS = 'follow/DELETE_FOLLOWS_JOURNAL_SUCCESS';
export const DELETE_FOLLOWS_JOURNAL_FAIL = 'follow/DELETE_FOLLOWS_JOURNAL_FAIL';

// Labels
export const POST_FOLLOWS_LABEL_LOAD = 'follow/POST_FOLLOWS_LABEL_LOAD';
export const POST_FOLLOWS_LABEL_SUCCESS = 'follow/POST_FOLLOWS_LABEL_SUCCESS';
export const POST_FOLLOWS_LABEL_FAIL = 'follow/POST_FOLLOWS_LABEL_FAIL';

export const PUT_FOLLOWS_LABEL_LOAD = 'follow/PUT_FOLLOWS_LABEL_LOAD';
export const PUT_FOLLOWS_LABEL_SUCCESS = 'follow/PUT_FOLLOWS_LABEL_SUCCESS';
export const PUT_FOLLOWS_LABEL_FAIL = 'follow/PUT_FOLLOWS_LABEL_FAIL';

export const DELETE_FOLLOWS_LABEL_LOAD = 'follow/DELETE_FOLLOWS_LABEL_LOAD';
export const DELETE_FOLLOWS_LABEL_SUCCESS = 'follow/DELETE_FOLLOWS_LABEL_SUCCESS';
export const DELETE_FOLLOWS_LABEL_FAIL = 'follow/DELETE_FOLLOWS_LABEL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
// Pubs
export function postFollowsPub(pubId) {
	return (dispatch) => {
		dispatch({ type: POST_FOLLOWS_PUB_LOAD });

		return clientFetch('/api/follows/pub', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_FOLLOWS_PUB_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_FOLLOWS_PUB_FAIL, error });
		});
	};
}

export function putFollowsPub(pubId, putOptions) {
	return (dispatch) => {
		dispatch({ type: PUT_FOLLOWS_PUB_LOAD });

		return clientFetch('/api/follows/pub', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
				...putOptions
			})
		})
		.then((result) => {
			dispatch({ type: PUT_FOLLOWS_PUB_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_FOLLOWS_PUB_FAIL, error });
		});
	};
}

export function deleteFollowsPub(pubId) {
	return (dispatch) => {
		dispatch({ type: DELETE_FOLLOWS_PUB_LOAD });

		return clientFetch('/api/follows/pub', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_FOLLOWS_PUB_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_FOLLOWS_PUB_FAIL, error });
		});
	};
}

// Users
export function postFollowsUser(userId) {
	return (dispatch) => {
		dispatch({ type: POST_FOLLOWS_USER_LOAD });

		return clientFetch('/api/follows/user', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_FOLLOWS_USER_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_FOLLOWS_USER_FAIL, error });
		});
	};
}

export function putFollowsUser(userId, putOptions) {
	return (dispatch) => {
		dispatch({ type: PUT_FOLLOWS_USER_LOAD });

		return clientFetch('/api/follows/user', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userId,
				...putOptions
			})
		})
		.then((result) => {
			dispatch({ type: PUT_FOLLOWS_USER_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_FOLLOWS_USER_FAIL, error });
		});
	};
}

export function deleteFollowsUser(userId) {
	return (dispatch) => {
		dispatch({ type: DELETE_FOLLOWS_USER_LOAD });

		return clientFetch('/api/follows/user', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: userId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_FOLLOWS_USER_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_FOLLOWS_USER_FAIL, error });
		});
	};
}

// Journals
export function postFollowsJournal(journalId) {
	return (dispatch) => {
		dispatch({ type: POST_FOLLOWS_JOURNAL_LOAD });

		return clientFetch('/api/follows/journal', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_FOLLOWS_JOURNAL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_FOLLOWS_JOURNAL_FAIL, error });
		});
	};
}

export function putFollowsJournal(journalId, putOptions) {
	return (dispatch) => {
		dispatch({ type: PUT_FOLLOWS_JOURNAL_LOAD });

		return clientFetch('/api/follows/journal', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
				...putOptions
			})
		})
		.then((result) => {
			dispatch({ type: PUT_FOLLOWS_JOURNAL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_FOLLOWS_JOURNAL_FAIL, error });
		});
	};
}

export function deleteFollowsJournal(journalId) {
	return (dispatch) => {
		dispatch({ type: DELETE_FOLLOWS_JOURNAL_LOAD });

		return clientFetch('/api/follows/journal', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				journalId: journalId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_FOLLOWS_JOURNAL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_FOLLOWS_JOURNAL_FAIL, error });
		});
	};
}

// Labels
export function postFollowsLabel(labelId) {
	return (dispatch) => {
		dispatch({ type: POST_FOLLOWS_LABEL_LOAD });

		return clientFetch('/api/follows/label', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				labelId: labelId,
			})
		})
		.then((result) => {
			dispatch({ type: POST_FOLLOWS_LABEL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_FOLLOWS_LABEL_FAIL, error });
		});
	};
}

export function putFollowsLabel(labelId, putOptions) {
	return (dispatch) => {
		dispatch({ type: PUT_FOLLOWS_LABEL_LOAD });

		return clientFetch('/api/follows/label', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				labelId: labelId,
				...putOptions
			})
		})
		.then((result) => {
			dispatch({ type: PUT_FOLLOWS_LABEL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_FOLLOWS_LABEL_FAIL, error });
		});
	};
}

export function deleteFollowsLabel(labelId) {
	return (dispatch) => {
		dispatch({ type: DELETE_FOLLOWS_LABEL_LOAD });

		return clientFetch('/api/follows/label', {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				labelId: labelId,
			})
		})
		.then((result) => {
			dispatch({ type: DELETE_FOLLOWS_LABEL_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: DELETE_FOLLOWS_LABEL_FAIL, error });
		});
	};
}
