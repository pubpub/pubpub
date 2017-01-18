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

export const POST_DOI_LOAD = 'pub/POST_DOI_LOAD';
export const POST_DOI_SUCCESS = 'pub/POST_DOI_SUCCESS';
export const POST_DOI_FAIL = 'pub/POST_DOI_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postVersion(pubId, versionMessage, isPublished, files, defaultFile, newFileAttribution, newFileRelations) {
	return (dispatch) => {
		dispatch({ type: POST_VERSION_LOAD });

		return clientFetch('/api/pub/version', {
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
				defaultFile: defaultFile,
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

export function putVersion(pubId, versionId, isPublished, isRestricted) {
	return (dispatch) => {
		dispatch({ type: PUT_VERSION_LOAD });

		return clientFetch('/api/pub/version', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				versionId: versionId, 
				isPublished: isPublished,
				isRestricted: isRestricted || null,
			})
		})
		.then((result) => {
			dispatch({ type: PUT_VERSION_SUCCESS, result, pubId: pubId, versionId: versionId, isPublished: isPublished, isRestricted: isRestricted });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_VERSION_FAIL, error });
		});
	};
}

export function postDoi(pubId, versionId) {
	return (dispatch) => {
		dispatch({ type: POST_DOI_LOAD });

		return clientFetch('/api/pub/version/doi', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				versionId: versionId, 
			})
		})
		.then((result) => {
			dispatch({ type: POST_DOI_SUCCESS, result, pubId: pubId, versionId: versionId });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_DOI_FAIL, error });
		});
	};
}
