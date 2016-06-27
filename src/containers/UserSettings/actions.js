/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const SAVE_SETTINGS_LOAD = 'userSettings/SAVE_SETTINGS_LOAD';
export const SAVE_SETTINGS_SUCCESS = 'userSettings/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAIL = 'userSettings/SAVE_SETTINGS_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function saveUserSettings(settings) {
	return {
		types: [SAVE_SETTINGS_LOAD, SAVE_SETTINGS_SUCCESS, SAVE_SETTINGS_FAIL],
		promise: (client) => client.post('/saveUserSettings', {data: {settings: settings}})
	};
}
