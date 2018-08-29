import React from 'react';
import PropTypes from 'prop-types';
import SimpleEditor from 'components/SimpleEditor/SimpleEditor';

const propTypes = {
	attrs: PropTypes.object.isRequired,
	updateAttrs: PropTypes.func.isRequired,
};

const PubSideControlsFootnote = (props)=> {
	return (
		<div className="pub-side-controls-footnote-component">
			<div className="options-title">Footnote Details</div>

			{/*  Content Adjustment */}
			<div className="form-label first">
				Content
			</div>
			<div className="simple-editor-wrapper">
				<SimpleEditor
					initialHtmlString={props.attrs.value}
					onChange={(htmlString)=> {
						props.updateAttrs({ value: htmlString });
					}}
				/>
			</div>

		</div>
	);
};


PubSideControlsFootnote.propTypes = propTypes;
export default PubSideControlsFootnote;
