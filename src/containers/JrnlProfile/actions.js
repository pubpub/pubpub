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

export const CREATE_COLLECTION_LOAD = 'jrnl/CREATE_COLLECTION_LOAD';
export const CREATE_COLLECTION_SUCCESS = 'jrnl/CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAIL = 'jrnl/CREATE_COLLECTION_FAIL';

export const UPDATE_COLLECTION_LOAD = 'jrnl/UPDATE_COLLECTION_LOAD';
export const UPDATE_COLLECTION_SUCCESS = 'jrnl/UPDATE_COLLECTION_SUCCESS';
export const UPDATE_COLLECTION_FAIL = 'jrnl/UPDATE_COLLECTION_FAIL';

export const DELETE_COLLECTION_LOAD = 'jrnl/DELETE_COLLECTION_LOAD';
export const DELETE_COLLECTION_SUCCESS = 'jrnl/DELETE_COLLECTION_SUCCESS';
export const DELETE_COLLECTION_FAIL = 'jrnl/DELETE_COLLECTION_FAIL';

export const FEATURE_ATOM_LOAD = 'jrnl/FEATURE_ATOM_LOAD';
export const FEATURE_ATOM_SUCCESS = 'jrnl/FEATURE_ATOM_SUCCESS';
export const FEATURE_ATOM_FAIL = 'jrnl/FEATURE_ATOM_FAIL';

export const REJECT_ATOM_LOAD = 'jrnl/REJECT_ATOM_LOAD';
export const REJECT_ATOM_SUCCESS = 'jrnl/REJECT_ATOM_SUCCESS';
export const REJECT_ATOM_FAIL = 'jrnl/REJECT_ATOM_FAIL';

export const COLLECTIONS_CHANGE_LOAD = 'jrnl/COLLECTIONS_CHANGE_LOAD';
export const COLLECTIONS_CHANGE_SUCCESS = 'jrnl/COLLECTIONS_CHANGE_SUCCESS';
export const COLLECTIONS_CHANGE_FAIL = 'jrnl/COLLECTIONS_CHANGE_FAIL';

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

export function createCollection(jrnlID, title) {
	return {
		types: [CREATE_COLLECTION_LOAD, CREATE_COLLECTION_SUCCESS, CREATE_COLLECTION_FAIL],
		promise: (client) => client.post('/createTag', {data: {
			jrnlID: jrnlID,
			title: title
		}})
	};
}

export function updateCollection(tagID, tagData) {
	return {
		types: [UPDATE_COLLECTION_LOAD, UPDATE_COLLECTION_SUCCESS, UPDATE_COLLECTION_FAIL],
		promise: (client) => client.post('/updateTag', {data: {
			tagID: tagID,
			tagData: tagData
		}})
	};
}

export function deleteCollection(jrnlID, tagID) {
	return {
		types: [DELETE_COLLECTION_LOAD, DELETE_COLLECTION_SUCCESS, DELETE_COLLECTION_FAIL],
		promise: (client) => client.post('/deleteTag', {data: {
			jrnlID: jrnlID,
			tagID: tagID
		}})
	};
}

export function featureAtom(jrnlID, atomID) {
	return {
		types: [FEATURE_ATOM_LOAD, FEATURE_ATOM_SUCCESS, FEATURE_ATOM_FAIL],
		promise: (client) => client.post('/featureAtom', {data: {
			jrnlID: jrnlID,
			atomID: atomID
		}})
	};
}

export function rejectAtom(jrnlID, atomID) {
	return {
		types: [REJECT_ATOM_LOAD, REJECT_ATOM_SUCCESS, REJECT_ATOM_FAIL],
		promise: (client) => client.post('/rejectAtom', {data: {
			jrnlID: jrnlID,
			atomID: atomID
		}})
	};
}

// These actions aren't acted upon in the reducer, we manage state locally, and send off changes to sync them, 
// but they're not needed to update the local state
export function collectionsChange(linkID, collectionIDs) {
	return {
		types: [COLLECTIONS_CHANGE_LOAD, COLLECTIONS_CHANGE_SUCCESS, COLLECTIONS_CHANGE_FAIL],
		promise: (client) => client.post('/collectionsChange', {data: {
			linkID: linkID,
			collectionIDs: collectionIDs,
		}})
	};
}
