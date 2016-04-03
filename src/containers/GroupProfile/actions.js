import analytics from '../utils/analytics';
/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_GROUP_LOAD = 'group/CREATE_GROUP_LOAD';
export const CREATE_GROUP_SUCCESS = 'group/CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAIL = 'group/CREATE_GROUP_FAIL';

export const LOAD_GROUP_LOAD = 'group/LOAD_GROUP_LOAD';
export const LOAD_GROUP_SUCCESS = 'group/LOAD_GROUP_SUCCESS';
export const LOAD_GROUP_FAIL = 'group/LOAD_GROUP_FAIL';

export const SAVE_GROUP_LOAD = 'group/SAVE_GROUP_LOAD';
export const SAVE_GROUP_SUCCESS = 'group/SAVE_GROUP_SUCCESS';
export const SAVE_GROUP_FAIL = 'group/SAVE_GROUP_FAIL';


/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
// export function toggleVisibility() {
// 	return {
// 		type: TOGGLE_VISIBILITY
// 	};	
// }

export function create(groupName, groupSlug) {
	analytics.sendEvent('GroupCreate', {
		groupName: groupName,
		groupSlug: groupSlug
	});

	return {
		types: [CREATE_GROUP_LOAD, CREATE_GROUP_SUCCESS, CREATE_GROUP_FAIL],
		promise: (client) => client.post('/groupCreate', {data: {
			groupName: groupName,
			groupSlug: groupSlug
		}})
	};
}


export function getGroup(groupSlug) {
	return {
		types: [LOAD_GROUP_LOAD, LOAD_GROUP_SUCCESS, LOAD_GROUP_FAIL],
		promise: (client) => client.get('/getGroup', {params: {groupSlug: groupSlug}})
	};
}

export function saveGroup(groupID, newObject) {
	return {
		types: [SAVE_GROUP_LOAD, SAVE_GROUP_SUCCESS, SAVE_GROUP_FAIL],
		promise: (client) => client.post('/groupSave', {data: {groupID: groupID, newObject: newObject}})
	};
}
