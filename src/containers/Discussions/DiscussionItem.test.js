import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {DiscussionItem} from './DiscussionItem.jsx'

describe('Components', () => {
	describe('DiscussionItem.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(DiscussionItem, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});
