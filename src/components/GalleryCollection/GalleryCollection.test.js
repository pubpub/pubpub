import React from 'react'
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import TestUtils from 'react-addons-test-utils'
import {expect} from 'chai';
import {checkWrappedRenderSuccess} from 'tests/helpersClient';
import GalleryCollection from './GalleryCollection.jsx';

describe('Components', () => {
	describe('GalleryCollection.jsx', () => {

		it('should exist when rendered with empty props', () => {
			const props = {};
			const {domRender, message, isErrorScreen} = checkWrappedRenderSuccess(GalleryCollection, props) ;

			expect(domRender).to.exist; // Successfully rendered into the DOM
			expect(isErrorScreen, message).to.be.false; // Did not render a Red warning screen
		});

	});
});
