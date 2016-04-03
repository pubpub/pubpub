import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';

import app from './containers/App/reducer';
import autocomplete from './containers/Autocomplete/reducer';
import editor from './containers/editor/reducer';
import explore from './containers/explore/reducer';
import discussions from './containers/discussions/reducer';
import group from './containers/group/reducer';
import journal from './containers/journal/reducer';
import landing from './containers/landing/reducer';
import login from './containers/login/reducer';
import nav from './containers/nav/reducer';
import user from './containers/user/reducer';
import pub from './containers/pub/reducer';
import resetPassword from './containers/resetPassword/reducer';
import subdomainTest from './containers/subdomainTest/reducer';

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
	app,
	autocomplete,
	editor,
	explore,
	discussions,
	group,
	journal,
	landing,
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
