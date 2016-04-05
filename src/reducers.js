import Immutable from 'immutable';
import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import { routerStateReducer } from 'redux-router';

import app from './containers/App/reducer';
import autocomplete from './containers/Autocomplete/reducer';
import editor from './containers/Editor/reducer';
import explore from './containers/Explore/reducer';
import discussions from './containers/Discussions/reducer';
import group from './containers/GroupProfile/reducer';
import journal from './containers/JournalProfile/reducer';
import landing from './containers/Landing/reducer';
import login from './containers/Login/reducer';
import user from './containers/UserProfile/reducer';
import pub from './containers/PubReader/reducer';
import resetPassword from './containers/ResetPassword/reducer';
import subdomainTest from './containers/SubdomainTest/reducer';

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
