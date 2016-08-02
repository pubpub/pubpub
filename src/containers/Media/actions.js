/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_MEDIA_LOAD = 'media/GET_MEDIA_LOAD';
export const GET_MEDIA_SUCCESS = 'media/GET_MEDIA_SUCCESS';
export const GET_MEDIA_FAIL = 'media/GET_MEDIA_FAIL';

export const CREATE_ATOM_LOAD = 'media/CREATE_ATOM_LOAD';
export const CREATE_ATOM_SUCCESS = 'media/CREATE_ATOM_SUCCESS';
export const CREATE_ATOM_FAIL = 'media/CREATE_ATOM_FAIL';

export const SAVE_VERSION_LOAD = 'media/SAVE_VERSION_LOAD';
export const SAVE_VERSION_SUCCESS = 'media/SAVE_VERSION_SUCCESS';
export const SAVE_VERSION_FAIL = 'media/SAVE_VERSION_FAIL';

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

export function createAtom(type, versionContent, title) {
	return {
		types: [CREATE_ATOM_LOAD, CREATE_ATOM_SUCCESS, CREATE_ATOM_FAIL],
		promise: (client) => client.post('/createAtom', {data: {
			type: type,
			versionContent: versionContent,
			title: title,
		}})
	};
}

export function saveVersion(newVersion) {
	return {
		types: [SAVE_VERSION_LOAD, SAVE_VERSION_SUCCESS, SAVE_VERSION_FAIL],
		promise: (client) => client.post('/saveVersion', {data: {
			'newVersion': newVersion,
		}})
	};
}
