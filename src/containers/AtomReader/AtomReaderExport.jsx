import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';

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
				
				<h2>Export</h2>
					
				<a href={pdfURL} style={globalStyles.link}><div className={'button'} style={styles.downloadButton}>Download PDF</div></a>
				<a href={markdownURL} style={globalStyles.link}><div className={'button'} style={styles.downloadButton}>Download Markdown</div></a>
				{/* <h3>Download XML</h3> */}
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
};
