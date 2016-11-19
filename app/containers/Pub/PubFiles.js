import React, { PropTypes } from 'react';
import Radium from 'radium';

let styles;

export const PubFiles = React.createClass({
	propTypes: {
		versionData: PropTypes.object,
	},

	render: function() {
		const versionData = this.props.versionData || {};
		return (
			<div style={styles.container}>
				<h2>Files</h2>
				{versionData.files.map((item)=> {
					return (
						<div style={styles.fileLine}>
							<div style={[styles.type, styles.fileType]}>{item.type}</div>
							<div style={styles.fileCell}>{item.name}</div>
							<div style={styles.fileType}>Edit with Tool</div>
						</div>
					);
				})}
			</div>
		);
	}
});

export default Radium(PubFiles);

styles = {
	container: {
		padding: '1em',
	},
	type: {
		fontSize: '0.85em',
		fontFamily: 'Courier',
	},
	fileLine: {
		display: 'table',
		width: '100%',
	},
	fileType: {
		display: 'table-cell',
		width: '100px',
	},
	fileCell: {
		display: 'table-cell',
	},
};
