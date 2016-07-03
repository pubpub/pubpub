// import analytics from 'utils/analytics';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_JRNL_LOAD = 'jrnl/GET_JRNL_LOAD';
export const GET_JRNL_SUCCESS = 'jrnl/GET_JRNL_SUCCESS';
export const GET_JRNL_FAIL = 'jrnl/GET_JRNL_FAIL';

export const UPDATE_JRNL_LOAD = 'jrnl/UPDATE_JRNL_LOAD';
export const UPDATE_JRNL_SUCCESS = 'jrnl/UPDATE_JRNL_SUCCESS';
export const UPDATE_JRNL_FAIL = 'jrnl/UPDATE_JRNL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getJrnl(slug, mode) {
	return {
		types: [GET_JRNL_LOAD, GET_JRNL_SUCCESS, GET_JRNL_FAIL],
		promise: (client) => client.get('/getJrnl', {params: {
			slug: slug,
			mode: mode
		}})
	};
}

export function updateJrnl(slug, newJrnlData) {
	return {
		types: [UPDATE_JRNL_LOAD, UPDATE_JRNL_SUCCESS, UPDATE_JRNL_FAIL],
		promise: (client) => client.post('/updateJrnl', {data: {
			slug: slug,
			newJrnlData: newJrnlData
		}})
	};
}
