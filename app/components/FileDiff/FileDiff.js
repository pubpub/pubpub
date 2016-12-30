import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import FileDiffImage from './FileDiffImage';
import FileDiffMarkdown from './FileDiffMarkdown';
let styles = {};

export const FileDiff = React.createClass({
	propTypes: {
		baseFile: PropTypes.object,
		targetFile: PropTypes.object,
	},

	getInitialState() {
		return {
			mode: 'Visual',
		};
	},

	render: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		console.log(targetFile);
		return (
			<div style={styles.container} className={'pt-card pt-elevation-0'}>
				
				<div style={styles.header}>
					<h6>{targetFile.name}</h6>
				</div>
				{targetFile.type === 'image/png' &&
					<FileDiffImage baseFile={baseFile} targetFile={targetFile} />
				}
				{targetFile.type === 'text/markdown' &&
					<FileDiffMarkdown baseFile={baseFile} targetFile={targetFile} />
				}
			</div>
		);
	}
});

export default Radium(FileDiff);

styles = {
	container: {
		margin: '1em',
		position: 'relative',
	},
	header: {
		marginBottom: '1.5em',
	},
};
