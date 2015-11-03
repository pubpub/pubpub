import { combineReducers } from 'redux';
// import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import editor from './editor';
import explore from './explore';
import landing from './landing';
import login from './login';
import profile from './profile';
import reader from './reader';

export default combineReducers({
	router: routerStateReducer,
	editor,
	explore,
	landing,
	login,
	profile,
	reader
});
