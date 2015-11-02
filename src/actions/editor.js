// import Immutable from 'immutable';

export const NARROW = 'editor/NARROW';
export const LOAD = 'editor/LOAD';
export const LOAD_SUCCESS = 'editor/LOAD_SUCCESS';
export const LOAD_FAIL = 'editor/LOAD_FAIL';

export function narrow(state) {
	let newMode = undefined;
	if (state.narrowMode === 'narrow') {
		newMode = 'wide';
	} else {
		newMode = 'narrow';
	}
	return newMode;
}

export function getProjects() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.get('/sampleProjects', {}) 
	};
}
