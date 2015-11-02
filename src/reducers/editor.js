import Immutable from 'immutable';

import {NARROW, narrow} from '../actions/editor';

const defaultState = {
	loading: 0, // Percent loaded
	firepadRef: 'kitty and dog', // contains content, assets, TOC, references, settings
	collaborators: new Immutable.Map({
		trich: {
			username: 'trich',
			mode: 'author'
		},
		thariq: {
			username: 'thariq',
			mode: 'author'
		}
	}),
	content: '#Hello \n Here is my content weee!',
	assets: new Immutable.List([]),
	TOC: new Immutable.List(['Hello']),
	references: new Immutable.List([]),
	setting: new Immutable.Map({}),
	narrowMode: 'wide'
};

export default function editorReducer(state = defaultState, action) {

	switch (action.type) {
	case NARROW:
		return {
			...state,
			narrowMode: narrow(state)
		};
	default:
		return state;
	}
}

// export function loadProjects(projectList) {
//   console.log('in load projects');
//   return {
//     types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
//     promise: (client) => client.post('/loadProjects', {data:projectList}) // params not used, just shown as demonstration
//   };
// }

// export function clearProjects() {
//   console.log('in clear projects');
//   return {
//     type: 'CLEAR_PROJECTS'
//   };
// }
