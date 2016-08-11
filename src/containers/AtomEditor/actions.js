/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
// export const CREATE_ATOM_LOAD = 'atomEdit/CREATE_ATOM_LOAD';
// export const CREATE_ATOM_SUCCESS = 'atomEdit/CREATE_ATOM_SUCCESS';
// export const CREATE_ATOM_FAIL = 'atomEdit/CREATE_ATOM_FAIL';

export const GET_ATOM_EDIT_LOAD = 'atomEdit/GET_ATOM_EDIT_LOAD';
export const GET_ATOM_EDIT_SUCCESS = 'atomEdit/GET_ATOM_EDIT_SUCCESS';
export const GET_ATOM_EDIT_FAIL = 'atomEdit/GET_ATOM_EDIT_FAIL';

export const SAVE_VERSION_LOAD = 'atomEdit/SAVE_VERSION_LOAD';
export const SAVE_VERSION_SUCCESS = 'atomEdit/SAVE_VERSION_SUCCESS';
export const SAVE_VERSION_FAIL = 'atomEdit/SAVE_VERSION_FAIL';

export const UPDATE_ATOM_DETAILS_LOAD = 'atomEdit/UPDATE_ATOM_DETAILS_LOAD';
export const UPDATE_ATOM_DETAILS_SUCCESS = 'atomEdit/UPDATE_ATOM_DETAILS_SUCCESS';
export const UPDATE_ATOM_DETAILS_FAIL = 'atomEdit/UPDATE_ATOM_DETAILS_FAIL';

export const PUBLISH_VERSION_LOAD = 'atomEdit/PUBLISH_VERSION_LOAD';
export const PUBLISH_VERSION_SUCCESS = 'atomEdit/PUBLISH_VERSION_SUCCESS';
export const PUBLISH_VERSION_FAIL = 'atomEdit/PUBLISH_VERSION_FAIL';

export const GET_EDIT_MODAL_DATA_LOAD = 'atomEdit/GET_EDIT_MODAL_DATA_LOAD';
export const GET_EDIT_MODAL_DATA_SUCCESS = 'atomEdit/GET_EDIT_MODAL_DATA_SUCCESS';
export const GET_EDIT_MODAL_DATA_FAIL = 'atomEdit/GET_EDIT_MODAL_DATA_FAIL';

export const ADD_CONTRIBUTOR_LOAD = 'atomEdit/ADD_CONTRIBUTOR_LOAD';
export const ADD_CONTRIBUTOR_SUCCESS = 'atomEdit/ADD_CONTRIBUTOR_SUCCESS';
export const ADD_CONTRIBUTOR_FAIL = 'atomEdit/ADD_CONTRIBUTOR_FAIL';

export const UPDATE_CONTRIBUTOR_LOAD = 'atomEdit/UPDATE_CONTRIBUTOR_LOAD';
export const UPDATE_CONTRIBUTOR_SUCCESS = 'atomEdit/UPDATE_CONTRIBUTOR_SUCCESS';
export const UPDATE_CONTRIBUTOR_FAIL = 'atomEdit/UPDATE_CONTRIBUTOR_FAIL';

export const DELETE_CONTRIBUTOR_LOAD = 'atomEdit/DELETE_CONTRIBUTOR_LOAD';
export const DELETE_CONTRIBUTOR_SUCCESS = 'atomEdit/DELETE_CONTRIBUTOR_SUCCESS';
export const DELETE_CONTRIBUTOR_FAIL = 'atomEdit/DELETE_CONTRIBUTOR_FAIL';


/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
// export function createAtom(type, versionContent) {
// 	return {
// 		types: [CREATE_ATOM_LOAD, CREATE_ATOM_SUCCESS, CREATE_ATOM_FAIL],
// 		promise: (client) => client.post('/createAtom', {data: {
// 			type: type,
// 			versionContent: versionContent
// 		}})
// 	};
// }

export function getAtomEdit(slug) {
	return {
		types: [GET_ATOM_EDIT_LOAD, GET_ATOM_EDIT_SUCCESS, GET_ATOM_EDIT_FAIL],
		promise: (client) => client.get('/getAtomEdit', {params: {
			'slug': slug,
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

export function updateAtomDetails(atomID, newDetails) {
	return {
		types: [UPDATE_ATOM_DETAILS_LOAD, UPDATE_ATOM_DETAILS_SUCCESS, UPDATE_ATOM_DETAILS_FAIL],
		promise: (client) => client.post('/updateAtomDetails', {data: {
			atomID: atomID,
			newDetails: newDetails,
		}})
	};
}

export function publishVersion(versionID) {
	return {
		types: [PUBLISH_VERSION_LOAD, PUBLISH_VERSION_SUCCESS, PUBLISH_VERSION_FAIL],
		promise: (client) => client.post('/setVersionPublished', {data: {
			versionID: versionID,
		}})
	};
}

export function getAtomEditModalData(atomID, mode) {
	return {
		types: [GET_EDIT_MODAL_DATA_LOAD, GET_EDIT_MODAL_DATA_SUCCESS, GET_EDIT_MODAL_DATA_FAIL],
		promise: (client) => client.get('/getAtomEditModalData', {params: {
			atomID: atomID,
			mode: mode,
		}})
	};
}

export function addContributor(atomID, contributorID) {
	return {
		types: [ADD_CONTRIBUTOR_LOAD, ADD_CONTRIBUTOR_SUCCESS, ADD_CONTRIBUTOR_FAIL],
		promise: (client) => client.post('/addContributor', {data: {
			atomID: atomID,
			contributorID: contributorID,
		}})
	};
}

export function updateContributor(linkID, linkType, linkRoles) {
	return {
		types: [UPDATE_CONTRIBUTOR_LOAD, UPDATE_CONTRIBUTOR_SUCCESS, UPDATE_CONTRIBUTOR_FAIL],
		promise: (client) => client.post('/updateContributor', {data: {
			linkID: linkID,
			linkType: linkType,
			linkRoles: linkRoles,
		}})
	};
}

export function deleteContributor(linkID) {
	return {
		types: [DELETE_CONTRIBUTOR_LOAD, DELETE_CONTRIBUTOR_SUCCESS, DELETE_CONTRIBUTOR_FAIL],
		promise: (client) => client.post('/deleteContributor', {data: {
			linkID: linkID,
		}})
	};
}


