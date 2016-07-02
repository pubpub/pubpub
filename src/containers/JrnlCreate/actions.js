import analytics from 'utils/analytics';

 /*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_JRNL_LOAD = 'jrnl/CREATE_JRNL_LOAD';
export const CREATE_JRNL_SUCCESS = 'jrnl/CREATE_JRNL_SUCCESS';
export const CREATE_JRNL_FAIL = 'jrnl/CREATE_JRNL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function createJrnl(newJrnlData) {
	const analyticsData = {
		newJrnlData: newJrnlData,
	};
	analytics.sendEvent('JournalCreate', analyticsData);

	return {
		types: [CREATE_JRNL_LOAD, CREATE_JRNL_SUCCESS, CREATE_JRNL_FAIL],
		promise: (client) => client.post('/createJrnl', {data: {
			'newJrnlData': newJrnlData
		}})
	};
}
