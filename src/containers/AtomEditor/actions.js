/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_ATOM_LOAD = 'journal/CREATE_ATOM_LOAD';
export const CREATE_ATOM_SUCCESS = 'journal/CREATE_ATOM_SUCCESS';
export const CREATE_ATOM_FAIL = 'journal/CREATE_ATOM_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createAtom(type) {
	return {
		types: [CREATE_ATOM_LOAD, CREATE_ATOM_SUCCESS, CREATE_ATOM_FAIL],
		promise: (client) => client.post('/createAtom', {data: {
			'type': type,
		}})
	};
}
