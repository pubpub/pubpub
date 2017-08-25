import { combineReducers } from 'redux';
import app from './app';
import pub from './pub';
import search from './search';
import user from './user';

export default combineReducers({
	app,
	pub,
	search,
	user,
});
