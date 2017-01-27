/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_HIGHLIGHT_LOAD = 'highlight/CREATE_HIGHLIGHT_LOAD';
export const CREATE_HIGHLIGHT_SUCCESS = 'highlight/CREATE_HIGHLIGHT_SUCCESS';
export const CREATE_HIGHLIGHT_FAIL = 'highlight/CREATE_HIGHLIGHT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function createHighlight(highlightObject) {

	return (dispatch) => {
		dispatch({ type: CREATE_HIGHLIGHT_LOAD });

		return clientFetch('/api/highlight', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: highlightObject.pubId,
				versionId: highlightObject.versionId,
				versionHash: highlightObject.versionHash,
				fileId: highlightObject.fileId,
				fileHash: highlightObject.fileHash,
				fileName: highlightObject.fileName,
				prefix: highlightObject.prefix,
				exact: highlightObject.exact,
				suffix: highlightObject.suffix,
				context: highlightObject.context,
			})
		})
		.then((result) => {
			dispatch({ type: CREATE_HIGHLIGHT_SUCCESS });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: CREATE_HIGHLIGHT_FAIL, error });
		});
	};
}
