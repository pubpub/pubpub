/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const NARROW = 'editor/NARROW';
export const LOAD = 'editor/LOAD';
export const LOAD_SUCCESS = 'editor/LOAD_SUCCESS';
export const LOAD_FAIL = 'editor/LOAD_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getProjects() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.get('/sampleProjects', {}) 
	};
}
