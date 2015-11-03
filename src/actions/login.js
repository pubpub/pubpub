/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const TOGGLE_VISIBILITY = 'login/TOGGLE_VISIBILITY';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function toggleVisibility() {
	return {
		type: TOGGLE_VISIBILITY
	};
}
