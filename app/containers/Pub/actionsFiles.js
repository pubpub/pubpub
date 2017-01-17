/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const PUT_DEFAULT_FILE_LOAD = 'pub/PUT_DEFAULT_FILE_LOAD';
export const PUT_DEFAULT_FILE_SUCCESS = 'pub/PUT_DEFAULT_FILE_SUCCESS';
export const PUT_DEFAULT_FILE_FAIL = 'pub/PUT_DEFAULT_FILE_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function putDefaultFile(pubId, versionId, defaultFile) {
	return (dispatch) => {
		dispatch({ type: PUT_DEFAULT_FILE_LOAD, versionId: versionId, defaultFile: defaultFile });

		return clientFetch('/api/pub/version', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				versionId: versionId,
				defaultFile: defaultFile, 
			})
		})
		.then((result) => {
			dispatch({ type: PUT_DEFAULT_FILE_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_DEFAULT_FILE_FAIL, error });
		});
	};
}
