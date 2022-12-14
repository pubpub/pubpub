import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import dataInitial from 'utils/storybook/data/dataInitial';
import { pubData, attributionsData } from 'utils/storybook/data';
import { generateMetaComponents } from '../ssr';

Enzyme.configure({ adapter: new Adapter() });
const defaultProps = {
	initialData: dataInitial,
	attributions: pubData.attributions,
	title: 'Test Pub',
};

const MetaComponents = (props) => <>{generateMetaComponents(props)}</>;

describe('generateMetaComponents', () => {
	it('generates citation_author metadata for every author WITHOUT a contributor role as their primary role', () => {
		const attributions = pubData.attributions.map((att) => ({ ...att }));
		attributions[0].roles = ['Editor'];
		attributions[1].roles = ['Test role', 'Editor'];

		const wrap = shallow(<MetaComponents {...defaultProps} attributions={attributions} />);
		expect(
			wrap.containsMatchingElement(<meta name="citation_author" content="Weiwei Hsu" />),
		).toBeFalsy();
		expect(
			wrap.containsMatchingElement(<meta name="citation_author" content="Hugh Dubberly" />),
		).toBeTruthy();
		expect(
			wrap.containsMatchingElement(<meta name="citation_author" content="Ian Reynolds" />),
		).toBeTruthy();
	});

	it('generates citation_editor metadata for every contributor WITH a contributor role as their primary role', () => {
		const attributions = pubData.attributions.map((att) => ({ ...att }));
		attributions[1].roles = ['Series Editor', 'Test role'];
		attributions[2].roles = ['Test role', 'Writing – Review & Editing'];

		const wrap = shallow(<MetaComponents {...defaultProps} attributions={attributions} />);
		expect(
			wrap.containsMatchingElement(<meta name="citation_editor" content="Weiwei Hsu" />),
		).toBeFalsy();
		expect(
			wrap.containsMatchingElement(<meta name="citation_editor" content="Hugh Dubberly" />),
		).toBeTruthy();
		expect(
			wrap.containsMatchingElement(<meta name="citation_editor" content="Ian Reynolds" />),
		).toBeFalsy();
	});

	it('generates the expected meta elements', () => {
		const props = {
			...defaultProps,
			attributions: [...attributionsData, ...pubData.attributions],
		};

		expect(generateMetaComponents(props as any)).toMatchSnapshot();
	});
});
