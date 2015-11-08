/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD_PUB = 'editor/LOAD_PUB';
export const LOAD_PUB_SUCCESS = 'editor/LOAD_PUB_SUCCESS';
export const LOAD_PUB_FAIL = 'editor/LOAD_PUB_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPub(slug) {
	return {
		types: [LOAD_PUB, LOAD_PUB_SUCCESS, LOAD_PUB_FAIL],
		promise: (client) => client.get('/getSamplePub', {params: {slug: slug}}) 
	};
}
