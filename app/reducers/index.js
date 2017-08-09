import { combineReducers } from 'redux';
import app from './app';
import user from './user';

export default combineReducers({
	app,
	user,
});
