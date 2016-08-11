import Immutable from 'immutable';
import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import app from './containers/App/reducer';
<<<<<<< Updated upstream
import atom from './containers/AtomReader/reducer';
import atomEdit from './containers/AtomEditor/reducer';
import emailVerification from './containers/EmailVerification/reducer';
import followButton from './containers/FollowButton/reducer';
=======
import autocomplete from './containers/Autocomplete/reducer';
import editor from './containers/Editor/reducer';
import emailVerification from './containers/EmailVerification/reducer';
import explore from './containers/Explore/reducer';
>>>>>>> Stashed changes
import discussions from './containers/Discussions/reducer';
import journalCreate from './containers/JournalCreate/reducer';
import journal from './containers/JournalProfile/reducer';
import landing from './containers/Landing/reducer';
import login from './containers/Login/reducer';
<<<<<<< Updated upstream
import media from './containers/Media/reducer';
=======
>>>>>>> Stashed changes
import signUp from './containers/SignUp/reducer';
import user from './containers/UserProfile/reducer';
import resetPassword from './containers/ResetPassword/reducer';

export default combineReducers({
	router: routerStateReducer,
	app,
<<<<<<< Updated upstream
	atom,
	atomEdit,
	emailVerification,
	followButton,
=======
	autocomplete,
	editor,
	emailVerification,
	explore,
>>>>>>> Stashed changes
	discussions,
	journalCreate,
	journal,
	landing,
	login,
<<<<<<< Updated upstream
	media,
	signUp,
	user,
=======
	signUp,
	user,
	pub,
>>>>>>> Stashed changes
	resetPassword
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
