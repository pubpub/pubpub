// import Immutable from 'immutable';

export const NARROW = 'editor/NARROW';

export function narrow(state) {
	let newMode = undefined;
	if (state.narrowMode === 'narrow') {
		newMode = 'wide';
	} else {
		newMode = 'narrow';
	}
	return newMode;
}
