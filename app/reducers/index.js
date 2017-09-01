import { combineReducers } from 'redux';
import app from './app';
import collection from './collection';
import login from './login';
import pub from './pub';
import search from './search';
import user from './user';

export default combineReducers({
	app,
	collection,
	login,
	pub,
	search,
	user,
});
