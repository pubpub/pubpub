/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const AUTOCOMPLETE_LOAD = 'autocomplete/AUTOCOMPLETE_LOAD';
export const AUTOCOMPLETE_SUCCESS = 'autocomplete/AUTOCOMPLETE_LOAD_SUCCESS';
export const AUTOCOMPLETE_FAIL = 'autocomplete/AUTOCOMPLETE_LOAD_FAIL';
export const AUTOCOMPLETE_CLEAR = 'autocomplete/AUTOCOMPLETE_LOAD_CLEAR';


/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

export function complete(autocompleteKey, route, string) {
	// check for cache
	if (string === '') {
		return {
			type: AUTOCOMPLETE_CLEAR,
			autocompleteKey: autocompleteKey
		};
	}
	return {
		types: [AUTOCOMPLETE_LOAD, AUTOCOMPLETE_SUCCESS, AUTOCOMPLETE_FAIL],
		autocompleteKey: autocompleteKey,
		string: string,
		promise: (client) => client.get(route, {params: {
			'string': string
		}})
	};
}

export function clear(autocompleteKey) {
	return {
		type: AUTOCOMPLETE_CLEAR,
		autocompleteKey: autocompleteKey
	};
}

export function completeFromCache(autocompleteKey, string, cachedResult) {
	return {
		type: AUTOCOMPLETE_SUCCESS,
		autocompleteKey: autocompleteKey,
		string: string,
		result: cachedResult 
	};
}
