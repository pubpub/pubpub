/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_ATOM_DATA_LOAD = 'atom/GET_ATOM_DATA_LOAD';
export const GET_ATOM_DATA_SUCCESS = 'atom/GET_ATOM_DATA_SUCCESS';
export const GET_ATOM_DATA_FAIL = 'atom/GET_ATOM_DATA_FAIL';

export const SUBMIT_ATOM_TO_JOURNAL_LOAD = 'atom/SUBMIT_ATOM_TO_JOURNAL_LOAD';
export const SUBMIT_ATOM_TO_JOURNAL_SUCCESS = 'atom/SUBMIT_ATOM_TO_JOURNAL_SUCCESS';
export const SUBMIT_ATOM_TO_JOURNAL_FAIL = 'atom/SUBMIT_ATOM_TO_JOURNAL_FAIL';

export const SAVE_VERSION_LOAD = 'atom/SAVE_VERSION_LOAD';
export const SAVE_VERSION_SUCCESS = 'atom/SAVE_VERSION_SUCCESS';
export const SAVE_VERSION_FAIL = 'atom/SAVE_VERSION_FAIL';

export const UPDATE_ATOM_DETAILS_LOAD = 'atom/UPDATE_ATOM_DETAILS_LOAD';
export const UPDATE_ATOM_DETAILS_SUCCESS = 'atom/UPDATE_ATOM_DETAILS_SUCCESS';
export const UPDATE_ATOM_DETAILS_FAIL = 'atom/UPDATE_ATOM_DETAILS_FAIL';

export const PUBLISH_VERSION_LOAD = 'atom/PUBLISH_VERSION_LOAD';
export const PUBLISH_VERSION_SUCCESS = 'atom/PUBLISH_VERSION_SUCCESS';
export const PUBLISH_VERSION_FAIL = 'atom/PUBLISH_VERSION_FAIL';

export const ADD_CONTRIBUTOR_LOAD = 'atom/ADD_CONTRIBUTOR_LOAD';
export const ADD_CONTRIBUTOR_SUCCESS = 'atom/ADD_CONTRIBUTOR_SUCCESS';
export const ADD_CONTRIBUTOR_FAIL = 'atom/ADD_CONTRIBUTOR_FAIL';

export const UPDATE_CONTRIBUTOR_LOAD = 'atom/UPDATE_CONTRIBUTOR_LOAD';
export const UPDATE_CONTRIBUTOR_SUCCESS = 'atom/UPDATE_CONTRIBUTOR_SUCCESS';
export const UPDATE_CONTRIBUTOR_FAIL = 'atom/UPDATE_CONTRIBUTOR_FAIL';

export const DELETE_CONTRIBUTOR_LOAD = 'atom/DELETE_CONTRIBUTOR_LOAD';
export const DELETE_CONTRIBUTOR_SUCCESS = 'atom/DELETE_CONTRIBUTOR_SUCCESS';
export const DELETE_CONTRIBUTOR_FAIL = 'atom/DELETE_CONTRIBUTOR_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function getAtomData(slug, meta, version) {
	return {
		types: [GET_ATOM_DATA_LOAD, GET_ATOM_DATA_SUCCESS, GET_ATOM_DATA_FAIL],
		promise: (client) => client.get('/getAtomData', {params: {
			slug: slug,
			meta: meta,
			version: version,
		}})
	};
}

export function submitAtomToJournals(atomID, journalIDs) {
	return {
		types: [SUBMIT_ATOM_TO_JOURNAL_LOAD, SUBMIT_ATOM_TO_JOURNAL_SUCCESS, SUBMIT_ATOM_TO_JOURNAL_FAIL],
		promise: (client) => client.post('/submitAtomToJournals', {data: {
			atomID: atomID,
			journalIDs: journalIDs,
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
		}}),
		atomID: atomID,
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
