import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';
import {Loader} from 'components';

let styles;

export const AtomReaderExport = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const markdownURL = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'markdownFile']);
		const pdfURL = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'PDFFile']);

		return (
			<div>
				
				<h2 className={'normalWeight'}>Export</h2>

				<a href={pdfURL} style={globalStyles.link}><div className={'button'} style={[styles.downloadButton, !pdfURL && styles.downloadDisabled]}>Download PDF</div></a>
				<a href={markdownURL} style={globalStyles.link}><div className={'button'} style={[styles.downloadButton, !markdownURL && styles.downloadDisabled]}>Download Markdown</div></a>
				{/* <h3>Download XML</h3> */}

				{(!pdfURL || !markdownURL) &&
					<div>Generating files... <Loader loading={true}/></div>
				}
			</div>
		);
	}
});

export default Radium(AtomReaderExport);

styles = {
	downloadButton: {
		padding: '2em',
		display: 'inline-block',
		margin: '1em 1em 1em 0em',
	},
	downloadDisabled: {
		opacity: '0.5',
		pointerEvents: 'none',
	},
};
