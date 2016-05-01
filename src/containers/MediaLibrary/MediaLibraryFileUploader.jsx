import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import Dropzone from 'react-dropzone';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import {LoaderDeterminate, LoaderIndeterminate} from 'components';
import {s3Upload} from 'utils/uploadFile';

let styles = {};

const FileUploader = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,
    onFileUpload: PropTypes.func,
    slug: PropTypes.string,
	},
	getDefaultProps: function() {
		return {
			insertHandler: ()=>{},
			editHandler: ()=>{},
			removeHandler: ()=>{},
		};
	},
  getInitialState: function() {
    return {
      percentLoaded: null
    }
  },

  onFileSelect: function(evt) {
    const file = evt.target.files[0];
    s3Upload(file, this.props.slug, this.onFileProgress, this.onFileFinish, 1);
	},

  // Update state's progress value when new events received.
  onFileProgress: function(evt, index) {
    const percentage = evt.loaded / evt.total;
    this.setState({percentLoaded: percentage});
  },


  // Response is used to craft the asset object that is added to firebase.
	onFileFinish: function(evt, index, type, filename, originalFilename) {

		let assetType = 'data';
		let thumbnail = '/thumbnails/data.png';

		if (type.indexOf('image') > -1) {
			assetType = 'image';
			thumbnail = 'https://s3.amazonaws.com/pubpub-upload/' + filename;
		} else if (type.indexOf('video') > -1) {
			assetType = 'video';
			thumbnail = '/thumbnails/file.png';
		}

		const newAsset = {
			assetType: assetType,
			label: originalFilename,
			assetData: {
				filetype: type,
				originalFilename: originalFilename,
				url: 'https://s3.amazonaws.com/pubpub-upload/' + filename,
				thumbnail: thumbnail,
			}
		};

		this.props.onFileUpload(newAsset);

	},


  onDrop: function(files) {

		// Add new files to existing set, so as to not overwrite existing uploads
		const existingFiles = this.state.files.length;
		const tmpFiles = this.state.files.concat(files);

		// For each new file, begin their upload process
		for (let fileCount = existingFiles; fileCount < existingFiles + files.length; fileCount++) {
			s3Upload(tmpFiles[fileCount], this.props.slug, this.onFileProgress, this.onFileFinish, fileCount);
		}

		// Set state with newly added files

	},


	render: function() {

		return (

			<div style={[styles.assetRowContainer]}>
        <input type="file" onChange={this.onFileSelect} />
        { (this.state.percentLoaded && this.state.percentLoaded <= 0.95) ? <LoaderDeterminate value={this.state.percentLoaded}/> : null }
			</div>

		);
	}
});

export default Radium(FileUploader);

const rowHeight = '30px';
styles = {
	assetRowContainer: {
		// height: rowHeight,
		width: 'calc(100% - 40px)',
		margin: '15px 20px',
		fontFamily: 'Courier',
		fontSize: '14px',

	},
	filename: {
		width: 'calc(15% - 4%)',
		padding: '0px 4% 0px 0px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	type: {
		width: 'calc(52% - 4% + 10%)',
		padding: '0px 2%',
		float: 'left',
	},

	delete: {
		width: '8%',
		padding: '0px 1%',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
		color: globalStyles.veryLight,
		textTransform: 'lowercase',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	headeRowContainer: {
		padding: '15px 15px 15px 15px',
	},
	hideOnLoad: {
		true: {
			display: 'none',
		}
	},
	showOnLoad: {
		false: {
			display: 'none'
		}
	},
	loadingBarWrapper: {
		height: 15,
		width: '70%',
		float: 'left',
		overflow: 'hidden',
		marginTop: 15,
	},
};
