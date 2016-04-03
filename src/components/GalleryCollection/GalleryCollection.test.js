import React from 'react'
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {checkWrappedRenderSuccess} from '../../../tests/helpersClient';
import CollectionGallery from './CollectionGallery.jsx';

describe('Components', () => {
	describe('CollectionGallery.jsx', () => {
  	
		it('should exist when rendered with empty props', () => {
			const props = {};
			const {domRender, message, isErrorScreen} = checkWrappedRenderSuccess(CollectionGallery, props) ;
			
			expect(domRender).to.exist; // Successfully rendered into the DOM
			expect(isErrorScreen, message).to.be.false; // Did not render a Red warning screen
		}); 

	});
});