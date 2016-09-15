/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_REPLY_DOCUMENT_LOAD = 'discussions/CREATE_REPLY_DOCUMENT_LOAD';
export const CREATE_REPLY_DOCUMENT_SUCCESS = 'discussions/CREATE_REPLY_DOCUMENT_SUCCESS';
export const CREATE_REPLY_DOCUMENT_FAIL = 'discussions/CREATE_REPLY_DOCUMENT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createReplyDocument(type, versionContent, title, replyTo, rootReply, highlightObject) {
	return {
		types: [CREATE_REPLY_DOCUMENT_LOAD, CREATE_REPLY_DOCUMENT_SUCCESS, CREATE_REPLY_DOCUMENT_FAIL],
		promise: (client) => client.post('/createReplyDocument', {data: {
			type: type,
			versionContent: versionContent,
			title: title,
			replyTo: replyTo,
			rootReply: rootReply,
			highlightObject: highlightObject,
		}})
	};
}
