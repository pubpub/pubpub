import {defaultState, NARROW, narrow, LOAD, LOAD_SUCCESS, LOAD_FAIL} from '../actions/editor';

export default function editorReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD:
		console.log('in Load');
		return {
			...state,
			loading: 50
		};
	case LOAD_SUCCESS:
		console.log('in load success');
		// console.log(action);
		return {
			...state,
			loading: 100,
			loaded: true,
			sampleOutput: action.result,
			error: null
		};
	case LOAD_FAIL:
		return {
			...state,
			loading: false,
			loaded: false,
			data: null,
			error: action.error
		};
	case NARROW:
		return {
			...state,
			narrowMode: narrow(state)
		};
	default:
		return state;
	}
}
