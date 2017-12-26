import { combineReducers } from 'redux';
import app from './app';
import collection from './collection';
import communityCreate from './communityCreate';
import explore from './explore';
import login from './login';
import passwordReset from './passwordReset';
import pub from './pub';
import pubCreate from './pubCreate';
import search from './search';
import signup from './signup';
import user from './user';
import userCreate from './userCreate';

export default combineReducers({
	app,
	collection,
	communityCreate,
	explore,
	login,
	passwordReset,
	pub,
	pubCreate,
	search,
	signup,
	user,
	userCreate,
});
