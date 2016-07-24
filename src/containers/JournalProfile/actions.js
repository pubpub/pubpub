// import analytics from 'utils/analytics';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_JOURNAL_LOAD = 'journal/GET_JOURNAL_LOAD';
export const GET_JOURNAL_SUCCESS = 'journal/GET_JOURNAL_SUCCESS';
export const GET_JOURNAL_FAIL = 'journal/GET_JOURNAL_FAIL';

export const UPDATE_JOURNAL_LOAD = 'journal/UPDATE_JOURNAL_LOAD';
export const UPDATE_JOURNAL_SUCCESS = 'journal/UPDATE_JOURNAL_SUCCESS';
export const UPDATE_JOURNAL_FAIL = 'journal/UPDATE_JOURNAL_FAIL';

export const CREATE_COLLECTION_LOAD = 'journal/CREATE_COLLECTION_LOAD';
export const CREATE_COLLECTION_SUCCESS = 'journal/CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAIL = 'journal/CREATE_COLLECTION_FAIL';

export const UPDATE_COLLECTION_LOAD = 'journal/UPDATE_COLLECTION_LOAD';
export const UPDATE_COLLECTION_SUCCESS = 'journal/UPDATE_COLLECTION_SUCCESS';
export const UPDATE_COLLECTION_FAIL = 'journal/UPDATE_COLLECTION_FAIL';

export const DELETE_COLLECTION_LOAD = 'journal/DELETE_COLLECTION_LOAD';
export const DELETE_COLLECTION_SUCCESS = 'journal/DELETE_COLLECTION_SUCCESS';
export const DELETE_COLLECTION_FAIL = 'journal/DELETE_COLLECTION_FAIL';

export const FEATURE_ATOM_LOAD = 'journal/FEATURE_ATOM_LOAD';
export const FEATURE_ATOM_SUCCESS = 'journal/FEATURE_ATOM_SUCCESS';
export const FEATURE_ATOM_FAIL = 'journal/FEATURE_ATOM_FAIL';

export const REJECT_ATOM_LOAD = 'journal/REJECT_ATOM_LOAD';
export const REJECT_ATOM_SUCCESS = 'journal/REJECT_ATOM_SUCCESS';
export const REJECT_ATOM_FAIL = 'journal/REJECT_ATOM_FAIL';

export const COLLECTIONS_CHANGE_LOAD = 'journal/COLLECTIONS_CHANGE_LOAD';
export const COLLECTIONS_CHANGE_SUCCESS = 'journal/COLLECTIONS_CHANGE_SUCCESS';
export const COLLECTIONS_CHANGE_FAIL = 'journal/COLLECTIONS_CHANGE_FAIL';

export const ADD_ADMIN_LOAD = 'journal/ADD_ADMIN_LOAD';
export const ADD_ADMIN_SUCCESS = 'journal/ADD_ADMIN_SUCCESS';
export const ADD_ADMIN_FAIL = 'journal/ADD_ADMIN_FAIL';

export const DELETE_ADMIN_LOAD = 'journal/DELETE_ADMIN_LOAD';
export const DELETE_ADMIN_SUCCESS = 'journal/DELETE_ADMIN_SUCCESS';
export const DELETE_ADMIN_FAIL = 'journal/DELETE_ADMIN_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getJournal(slug, mode) {
	return {
		types: [GET_JOURNAL_LOAD, GET_JOURNAL_SUCCESS, GET_JOURNAL_FAIL],
		promise: (client) => client.get('/getJournal', {params: {
			slug: slug,
			mode: mode
		}})
	};
}

export function updateJournal(slug, newJournalData) {
	return {
		types: [UPDATE_JOURNAL_LOAD, UPDATE_JOURNAL_SUCCESS, UPDATE_JOURNAL_FAIL],
		promise: (client) => client.post('/updateJournal', {data: {
			slug: slug,
			newJournalData: newJournalData
		}})
	};
}

export function createCollection(journalID, title) {
	return {
		types: [CREATE_COLLECTION_LOAD, CREATE_COLLECTION_SUCCESS, CREATE_COLLECTION_FAIL],
		promise: (client) => client.post('/createTag', {data: {
			journalID: journalID,
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

export function deleteCollection(journalID, tagID) {
	return {
		types: [DELETE_COLLECTION_LOAD, DELETE_COLLECTION_SUCCESS, DELETE_COLLECTION_FAIL],
		promise: (client) => client.post('/deleteTag', {data: {
			journalID: journalID,
			tagID: tagID
		}})
	};
}

export function featureAtom(journalID, atomID) {
	return {
		types: [FEATURE_ATOM_LOAD, FEATURE_ATOM_SUCCESS, FEATURE_ATOM_FAIL],
		promise: (client) => client.post('/featureAtom', {data: {
			journalID: journalID,
			atomID: atomID
		}})
	};
}

export function rejectAtom(journalID, atomID) {
	return {
		types: [REJECT_ATOM_LOAD, REJECT_ATOM_SUCCESS, REJECT_ATOM_FAIL],
		promise: (client) => client.post('/rejectAtom', {data: {
			journalID: journalID,
			atomID: atomID
		}})
	};
}

export function addAdmin(journalID, adminID) {
	return {
		types: [ADD_ADMIN_LOAD, ADD_ADMIN_SUCCESS, ADD_ADMIN_FAIL],
		promise: (client) => client.post('/addJournalAdmin', {data: {
			journalID: journalID,
			adminID: adminID,
		}})
	};
}

export function deleteAdmin(journalID, adminID) {
	return {
		types: [DELETE_ADMIN_LOAD, DELETE_ADMIN_SUCCESS, DELETE_ADMIN_FAIL],
		promise: (client) => client.post('/deleteJournalAdmin', {data: {
			journalID: journalID,
			adminID: adminID,
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
