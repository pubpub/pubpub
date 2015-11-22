/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_PUB_LOAD = 'login/CREATE_PUB_LOAD';
export const CREATE_PUB_SUCCESS = 'login/CREATE_PUB_LOAD_SUCCESS';
export const CREATE_PUB_FAIL = 'login/CREATE_PUB_LOAD_FAIL';


/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/


export function create(title, slug) {
	return {
		types: [CREATE_PUB_LOAD, CREATE_PUB_SUCCESS, CREATE_PUB_FAIL],
		promise: (client) => client.post('/createPub', {data: {
			'title': title,
			'slug': slug
		}})
	};
}
