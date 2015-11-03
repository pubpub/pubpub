import Immutable from 'immutable';

// const defaultState = {
// 	loading: 0, // Percent loaded
// 	firepadRef: 'kitty and dog', // contains content, assets, TOC, references, settings
// 	collaborators: new Immutable.Map({
// 		trich: {
// 			username: 'trich',
// 			mode: 'author'
// 		},
// 		thariq: {
// 			username: 'thariq',
// 			mode: 'author'
// 		}
// 	}),
// 	content: '#Hello \n Here is my content weee!',
// 	assets: new Immutable.List([]),
// 	TOC: new Immutable.List(['Hello']),
// 	references: new Immutable.List([]),
// 	setting: new Immutable.Map({}),
// 	narrowMode: 'wide'
// };

export const defaultState = Immutable.Map({
	narrowMode: 'wide',
});

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
