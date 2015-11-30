/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const TOGGLE_MENU = 'nav/TOGGLE_MENU';
export const OPEN_MENU = 'nav/OPEN_MENU';
export const CLOSE_MENU = 'nav/CLOSE_MENU';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function toggleMenu() {
	return {
		type: TOGGLE_MENU
	};	
}

export function openMenu() {
	return {
		type: OPEN_MENU
	};	
}

export function closeMenu() {
	return {
		type: CLOSE_MENU
	};	
}

