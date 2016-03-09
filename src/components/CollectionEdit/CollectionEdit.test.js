import React from 'react'
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {checkRenderSuccess} from '../../utils/testFunctions';
import CollectionEdit from './CollectionEdit.jsx';

describe('Components', () => {
	describe('CollectionEdit.jsx', () => {
  	
		it('should exist when rendered with empty props', () => {
			const props = {};
			const {domRender, shallowRender, message} = checkRenderSuccess(CollectionEdit, props) ;

			expect(domRender).to.exist; // Successfully rendered into the DOM
			expect(shallowRender.type.name, message).to.not.equal('RedBox'); // Did not render a Red warning screen
		}); 

	});
});