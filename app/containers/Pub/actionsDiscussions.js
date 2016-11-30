/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_DISCUSSION_LOAD = 'pub/POST_DISCUSSION_LOAD';
export const POST_DISCUSSION_SUCCESS = 'pub/POST_DISCUSSION_SUCCESS';
export const POST_DISCUSSION_FAIL = 'pub/POST_DISCUSSION_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postDiscussion(replyRootPubId, replyParentPubId, title, description, labels) {
	return (dispatch) => {
		dispatch({ type: POST_DISCUSSION_LOAD });

		return clientFetch('/api/pub/discussions', {
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