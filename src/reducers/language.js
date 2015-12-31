import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {

	LOAD_JOURNAL_AND_LOGIN,
	LOAD_JOURNAL_AND_LOGIN_SUCCESS,
	LOAD_JOURNAL_AND_LOGIN_FAIL,

} from '../actions/journal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	locale: 'en',
	languageObject: {},
});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/
function setLanguage(state, result) {
	console.log('in set language');
	console.log(result);
	return state.merge({
		locale: result.locale,
		languageObject: result.languageObject,
	});
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {

	switch (action.type) {
	
	case LOAD_JOURNAL_AND_LOGIN:
		return state;
	case LOAD_JOURNAL_AND_LOGIN_SUCCESS:
		return setLanguage(state, action.result.languageData);
	case LOAD_JOURNAL_AND_LOGIN_FAIL:
		return state;

	default:
		return ensureImmutable(state);
	}
}
