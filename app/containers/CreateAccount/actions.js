export const GET_SIGN_UP_DATA_LOAD = 'GET_SIGN_UP_DATA_LOAD';
export const GET_SIGN_UP_DATA_SUCCESS = 'GET_SIGN_UP_DATA_SUCCESS';
export const GET_SIGN_UP_DATA_FAIL = 'GET_SIGN_UP_DATA_FAIL';

export function getSignUpData(hash) {
	return (dispatch) => {
		dispatch({ type: GET_SIGN_UP_DATA_LOAD });

		return clientFetch('/api/signup?hash=' + hash, {
			method: 'GET'
		})
		.then((result) => {
			dispatch({ type: GET_SIGN_UP_DATA_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: GET_SIGN_UP_DATA_FAIL, error });
		});
	};
}
