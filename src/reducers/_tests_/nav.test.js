import {expect} from 'chai';
import {Map} from 'immutable';

import reducer from '../nav';
import {
	OPEN_MENU,
	CLOSE_MENU,
} from '../../actions/nav';

describe('Reducers', () => {
	describe('nav.js', () => {
		
		it('should return a default state', () => {
			const newState = reducer(undefined, {});
			expect(newState).to.exist;
		});

		it('should handle OPEN_MENU', () => {
			const action = {
				type: OPEN_MENU,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('menuOpen')).to.be.true;
		});

		it('should handle CLOSE_MENU', () => {
			const action = {
				type: CLOSE_MENU,
			};

			const state = Map();
			const newState = reducer(state, action);

			expect(newState.get('menuOpen')).to.be.false;
		});

	});
});
