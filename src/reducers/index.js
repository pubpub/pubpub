import { combineReducers } from 'redux';
// import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import editor from './editor';

export default combineReducers({
	router: routerStateReducer,
	editor
});
