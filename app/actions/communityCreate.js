import { apiFetch } from 'utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_COMMUNITY_LOAD = 'communityCreate/POST_COMMUNITY_LOAD';
export const POST_COMMUNITY_SUCCESS = 'communityCreate/POST_COMMUNITY_SUCCESS';
export const POST_COMMUNITY_FAIL = 'communityCreate/POST_COMMUNITY_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postCommunity({ subdomain, title, description, smallHeaderLogo, largeHeaderLogo, accentColor }) {
	return (dispatch) => {
		dispatch({ type: POST_COMMUNITY_LOAD });
		return apiFetch('/communities', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subdomain,
				title,
				description,
				smallHeaderLogo,
				largeHeaderLogo,
				accentColor,
			})
		})
		.then((result) => {
			dispatch({ type: POST_COMMUNITY_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: POST_COMMUNITY_FAIL, error });
		});
	};
}
