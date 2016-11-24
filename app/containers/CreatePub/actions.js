/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_PUB_LOAD = 'createAccount/CREATE_PUB_LOAD';
export const CREATE_PUB_SUCCESS = 'createAccount/CREATE_PUB_SUCCESS';
export const CREATE_PUB_FAIL = 'createAccount/CREATE_PUB_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createPub(createData) {
	return (dispatch) => {
		dispatch({ type: CREATE_PUB_LOAD });

		return clientFetch('/api/pub', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: createData.title,
				description: createData.description,
				previewImage: createData.previewImage,
				slug: createData.slug,

			})
		})
		.then((result) => {
			dispatch({ type: CREATE_PUB_SUCCESS, result, slug: createData.slug });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: CREATE_PUB_FAIL, error });
		});
	};
}
