/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const UPDATE_DELTA = 'nav/UPDATE_DELTA';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function updateDelta(delta) {
	return {
		type: UPDATE_DELTA,
		delta: delta,
	};	
}
