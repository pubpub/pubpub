import React from 'react';
import PropTypes from 'prop-types';
import fuzzysearch from 'fuzzysearch';

import Footnotes, { footnotePropType } from './Footnotes';
import PubBottomSection from './PubBottomSection';

require('./pubBottom.scss');

const propTypes = {
	pubData: PropTypes.shape({
		citations: PropTypes.arrayOf(footnotePropType.node).isRequired,
		footnotes: PropTypes.arrayOf(footnotePropType).isRequired,
	}).isRequired,
};

const PubBottom = (props) => {
	const {
		pubData: { citations, footnotes },
	} = props;
	return (
		<div className="pub-bottom-component">
			<div className="inner">
				<PubBottomSection title="References" isSearchable={true}>
					{({ searchTerm }) => (
						<Footnotes
							footnotes={footnotes.filter(
								(fn) =>
									!searchTerm ||
									fuzzysearch(searchTerm.toLowerCase(), fn.content.toLowerCase()),
							)}
						/>
					)}
				</PubBottomSection>
				<PubBottomSection title="Citations" isSearchable={true}>
					{({ searchTerm }) => (
						<Footnotes
							footnotes={citations.filter(
								(ct) =>
									!searchTerm ||
									fuzzysearch(searchTerm.toLowerCase(), ct.content.toLowerCase()),
							)}
						/>
					)}
				</PubBottomSection>
			</div>
		</div>
	);
};

PubBottom.propTypes = propTypes;
export default PubBottom;
