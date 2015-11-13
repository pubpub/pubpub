import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const EditorModalAssetsRow = React.createClass({
	propTypes: {
		thumbnail: PropTypes.string,
		filename: PropTypes.string,
		assetType: PropTypes.string,
		date: PropTypes.string,
		author: PropTypes.string,
		url: PropTypes.string,
		isLoading: PropTypes.bool,
		percentLoaded: PropTypes.number,
		isHeader: PropTypes.bool
	},

	render: function() {
		return (
			<div style={styles.assetRowContainer}>
				<div style={styles.thumbnail}>
					<div style={styles.inlineBlockHelper}></div>
					<img style={styles.thumbnailImg} src={this.props.thumbnail} />
				</div>
				<div style={styles.filename}>{this.props.filename}</div>
				<div style={[styles.type, styles[this.props.assetType]]}>{this.props.assetType}</div>
				<div style={styles.date}>{this.props.date}</div>
				<div style={styles.author}>{this.props.author}</div>
				<div style={styles.delete}>delete</div>
			</div>
		);
	}
});

export default Radium(EditorModalAssetsRow);

const rowHeight = '30px';
styles = {
	assetRowContainer: {
		height: rowHeight,
		width: '100%',
		padding: 10,
	},
	thumbnail: {
		height: rowHeight,
		width: rowHeight,
		padding: 2,
		float: 'left',
		position: 'relative',
		textAlign: 'center',
	},
	thumbnailImg: {
		display: 'inline-block',
		verticalAlign: 'middle',
		maxHeight: rowHeight,
		maxWidth: rowHeight,
	},
	inlineBlockHelper: {
		display: 'inline-block',
		verticalAlign: 'middle',
		height: '100%',
	},
	filename: {
		width: 150,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	type: {
		lineHeight: rowHeight,
		height: rowHeight,
		margin: 5,
		borderRadius: 2,
		backgroundColor: 'rgba(200,30,30,0.4)',
		float: 'left',
	},
	date: {
		width: 150,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	author: {
		width: 150,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	delete: {
		width: 90,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},

};
