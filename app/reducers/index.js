import { combineReducers } from 'redux';
import app from './app';
import collection from './collection';
import login from './login';
import pub from './pub';
import search from './search';
import signup from './signup';
import user from './user';
import userCreate from './userCreate';

export default combineReducers({
	app,
	collection,
	login,
	pub,
	search,
	signup,
	user,
	userCreate,
});
