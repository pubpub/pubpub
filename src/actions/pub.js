/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_PUB_LOAD = 'pub/CREATE_PUB_LOAD';
export const CREATE_PUB_SUCCESS = 'pub/CREATE_PUB_SUCCESS';
export const CREATE_PUB_FAIL = 'pub/CREATE_PUB_FAIL';

export const CLEAR_PUB = 'pub/CLEAR_PUB';

export const LOAD_PUB = 'pub/LOAD_PUB';
export const LOAD_PUB_SUCCESS = 'pub/LOAD_PUB_SUCCESS';
export const LOAD_PUB_FAIL = 'pub/LOAD_PUB_FAIL';

export const OPEN_PUB_MODAL = 'pub/OPEN_PUB_MODAL';
export const CLOSE_PUB_MODAL = 'pub/CLOSE_PUB_MODAL';

export const ADD_DISCUSSION = 'pub/ADD_DISCUSSION';
export const ADD_DISCUSSION_SUCCESS = 'pub/ADD_DISCUSSION_SUCCESS';
export const ADD_DISCUSSION_FAIL = 'pub/ADD_DISCUSSION_FAIL';

export const ADD_SELECTION = 'pub/ADD_SELECTION';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function create(title, slug) {
	console.log('in create action');
	return {
		types: [CREATE_PUB_LOAD, CREATE_PUB_SUCCESS, CREATE_PUB_FAIL],
		promise: (client) => client.post('/createPub', {data: {
			'title': title,
			'slug': slug
		}}),
		title: title,
	};
}

export function clearPub() {
	return {
		type: CLEAR_PUB,
	};
}

export function getPub(slug) {
	return {
		types: [LOAD_PUB, LOAD_PUB_SUCCESS, LOAD_PUB_FAIL],
		promise: (client) => client.get('/getPub', {params: {slug: slug}}) 
	};
}

export function openPubModal(modal) {
	return {
		type: OPEN_PUB_MODAL,
		modal: modal,
	};	
}

export function closePubModal() {
	return {
		type: CLOSE_PUB_MODAL,
	};	
}

export function addDiscussion(discussionObject) {
	return {
		types: [ADD_DISCUSSION, ADD_DISCUSSION_SUCCESS, ADD_DISCUSSION_FAIL],
		promise: (client) => client.post('/addDiscussion', {data: {discussionObject: discussionObject}}) 
	};
}

export function addSelection(selection) {
	return {
		type: ADD_SELECTION,
		selection: selection,
	};	
}
