/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_MEDIA_LOAD = 'asset/GET_MEDIA_LOAD';
export const GET_MEDIA_SUCCESS = 'asset/GET_MEDIA_SUCCESS';
export const GET_MEDIA_FAIL = 'asset/GET_MEDIA_FAIL';

export const CREATE_ATOM_LOAD = 'atomEdit/CREATE_ATOM_LOAD';
export const CREATE_ATOM_SUCCESS = 'atomEdit/CREATE_ATOM_SUCCESS';
export const CREATE_ATOM_FAIL = 'atomEdit/CREATE_ATOM_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getMedia(filterParams) {
	return {
		types: [GET_MEDIA_LOAD, GET_MEDIA_SUCCESS, GET_MEDIA_FAIL],
		promise: (client) => client.get('/getMedia', {params: {
			filterParams: filterParams
		}})
	};
}

export function createAtom(type, versionContent) {
	return {
		types: [CREATE_ATOM_LOAD, CREATE_ATOM_SUCCESS, CREATE_ATOM_FAIL],
		promise: (client) => client.post('/createAtom', {data: {
			type: type,
			versionContent: versionContent
		}})
	};
}
