import { combineReducers } from 'redux';
import app from './app';
import pub from './pub';
import user from './user';

export default combineReducers({
	app,
	pub,
	user,
});
