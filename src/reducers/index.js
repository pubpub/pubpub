import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';

import autocomplete from './autocomplete';
import editor from './editor';
import explore from './explore';
import journal from './journal';
import landing from './landing';
import language from './language';
import login from './login';
import nav from './nav';
import user from './user';
import pub from './pub';
import resetPassword from './resetPassword';
import subdomainTest from './subdomainTest';


export default combineReducers({
	router: routerStateReducer,
	form: formReducer.normalize({
		pubCreateForm: {
			slug: value => value && value.replace(/[^\w\s-]/gi, '').replace(/ /g, '_'),
		},
		journalCreateForm: {
			subdomain: value => value && value.replace(/[^\w\s-]/gi, '').replace(/ /g, '_').toLowerCase(),
		},
	}),
	autocomplete,
	editor,
	explore,
	journal,
	landing,
	language,
	login,
	nav,
	user,
	pub,
	resetPassword,
	subdomainTest
});

export function ensureImmutable(state) {
	// For some reason the @@INIT action is receiving a state variable that is a regular object.
	// If that's the case, cast it to Immutable and keep chugging.
	// If the @@INIT weirdness can be solved, we can remove this function.
	let output;
	if (!Immutable.Iterable.isIterable(state)) {
		output = Immutable.fromJS(state);
	} else {
		output = state;	
	}
	return output;
}
