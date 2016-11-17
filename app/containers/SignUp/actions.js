/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_SIGN_UP_LOAD = 'signUp/CREATE_SIGN_UP_LOAD';
export const CREATE_SIGN_UP_SUCCESS = 'signUp/CREATE_SIGN_UP_SUCCESS';
export const CREATE_SIGN_UP_FAIL = 'signUp/CREATE_SIGN_UP_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createSignUp(email) {
	return (dispatch) => {
		dispatch({ type: CREATE_SIGN_UP_LOAD });

		return clientFetch('/api/signup', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
			})
		})
		.then((result) => {
			dispatch({ type: CREATE_SIGN_UP_SUCCESS, result, email: email });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: CREATE_SIGN_UP_FAIL, error });
		});
	};
}
