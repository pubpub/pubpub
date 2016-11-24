/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_VERSION_LOAD = 'pub/POST_VERSION_LOAD';
export const POST_VERSION_SUCCESS = 'pub/POST_VERSION_SUCCESS';
export const POST_VERSION_FAIL = 'pub/POST_VERSION_FAIL';

export const PUT_VERSION_LOAD = 'pub/PUT_VERSION_LOAD';
export const PUT_VERSION_SUCCESS = 'pub/PUT_VERSION_SUCCESS';
export const PUT_VERSION_FAIL = 'pub/PUT_VERSION_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postVersion(pubId, versionMessage, isPublished, files, newFileAttribution, newFileRelations) {
	return (dispatch) => {
		dispatch({ type: POST_VERSION_LOAD });

		return clientFetch('/api/pub/versions', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				versionMessage: versionMessage, 
				isPublished: isPublished, 
				files: files, 
				newFileAttribution: newFileAttribution, 
				newFileRelations: newFileRelations, 
			})
		})
		.then((result) => {
			dispatch({ type: POST_VERSION_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_VERSION_FAIL, error });
		});
	};
}

export function putContributor(pubId, contributorId, canEdit, canRead, isAuthor, isHidden) {
	return (dispatch) => {
		dispatch({ type: PUT_VERSION_LOAD });

		return clientFetch('/api/pub/versions', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				contributorId: contributorId, 
				canEdit: canEdit, 
				canRead: canRead, 
				isAuthor: isAuthor, 
				isHidden: isHidden
			})
		})
		.then((result) => {
			dispatch({ type: PUT_VERSION_SUCCESS, result, contributorId: contributorId, isAuthor: isAuthor });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_VERSION_FAIL, error });
		});
	};
}
