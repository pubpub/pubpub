import Immutable from 'immutable';
import { combineReducers } from 'redux';
import account from './account';
import activities from './activities';
import app from './app';
import createPub from './createPub';
import createJournal from './createJournal';
import followButton from './followButton';
import journal from './journal';
import label from './label';
import login from './login';
import pub from './pub';
import search from './search';
import signUp from './signUp';
import user from './user';
import resetPassword from './resetPassword';

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

export default combineReducers({
	account,
	activities,
	app,
	createPub,
	createJournal,
	followButton,
	journal,
	label,
	login,
	pub,
	search,
	signUp,
	user,
	resetPassword,
});
