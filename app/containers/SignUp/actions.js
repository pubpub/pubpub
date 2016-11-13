export const CREATE_SIGN_UP_LOAD = 'CREATE_SIGN_UP_LOAD';
export const CREATE_SIGN_UP_SUCCESS = 'CREATE_SIGN_UP_SUCCESS';
export const CREATE_SIGN_UP_FAIL = 'CREATE_SIGN_UP_FAIL';

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
