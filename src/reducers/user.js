import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {LOAD_PROFILE, LOAD_PROFILE_SUCCESS, LOAD_PROFILE_FAIL} from '../actions/user';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	profileData: {},
	status: 'loading',
	error: null
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function load(state) {
	return state.set('status', 'loading');
}

function loadSuccess(state, result) {
	const outputState = {
		status: 'loaded',
		profileData: result,
		error: null
	};
	
	if (result === 'User Not Found') {
		outputState.profileData = { ...defaultState.get('profileData'),
			name: 'User Not Found',
			image: 'http://res.cloudinary.com/pubpub/image/upload/v1448221655/pubSad_blirpk.png'
		};
	}

	return state.merge(outputState);
}

function loadFail(state, error) {
	console.log('in loadFail');

	const outputState = {
		status: 'loaded',
		profileData: { ...defaultState.get('profileData'),
			name: 'Error Loading User',
			image: 'http://res.cloudinary.com/pubpub/image/upload/v1448221655/pubSad_blirpk.png'
		},
		error: error
	};

	return state.merge(outputState);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function profileReducer(state = defaultState, action) {

	switch (action.type) {
	case LOAD_PROFILE:
		return load(state);
	case LOAD_PROFILE_SUCCESS:
		return loadSuccess(state, action.result);
	case LOAD_PROFILE_FAIL:
		return loadFail(state, action.error);
	default:
		return ensureImmutable(state);
	}
}
