import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {SortableItem} from './SortableItem.jsx'

describe('Components', () => {
	describe('SortableItem.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(SortableItem, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});
