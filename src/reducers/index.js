import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';

import autocomplete from './autocomplete';
import editor from './editor';
import explore from './explore';
import group from './group';
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
			slug: (value, previousValue, allValues, previousAllValues) => {
				let newVal = value;
				if (newVal === undefined || (previousAllValues.title && previousAllValues.title.replace && newVal === previousAllValues.title.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase())) {
					newVal = allValues.title;
				}
				return newVal && newVal.replace && newVal.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase();
			}
		},
		journalCreateForm: {
			subdomain: value => value && value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase(),
		},
		groupCreateForm: {
			groupSlug: (value, previousValue, allValues, previousAllValues) => {
				let newVal = value;
				if (newVal === undefined || (previousAllValues.groupName && previousAllValues.groupName.replace && newVal === previousAllValues.groupName.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase())) {
					newVal = allValues.groupName;
				}
				return newVal && newVal.replace && newVal.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase();
			}
		},
	}),
	autocomplete,
	editor,
	explore,
	group,
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
