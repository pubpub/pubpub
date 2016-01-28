import React, {PropTypes} from 'react';
import Media from './baseMediaPlugin';
import createPubPubPlugin from './PubPub';
import ErrorMsg from './ErrorPlugin';

const VideoInputFields = [
	{title: 'source', type: 'asset', params: {assetType: 'video'}},
	{title: 'align', type: 'align'},
	{title: 'size', type: 'size'},
	{title: 'caption', type: 'text', params: {placeholder: 'Caption describing the video'}},
	{title: 'reference', type: 'reference'},

];

const VideoConfig = {
	title: 'video',
	inline: true,
	autocomplete: true
};

let styles = {};

const VideoPlugin = React.createClass({
	propTypes: {
		url: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.string,
		caption: PropTypes.string,
		size: React.PropTypes.oneOf(['small', 'medium', 'large']),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		source: PropTypes.object,
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		let html;

		if (!this.props.source || !this.props.source.url_s3) {
			return (<span></span>);
		}
		const url = this.props.source.url_s3;

		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;


		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Could not find video asset.</ErrorMsg>;
		} else {
			html = (
				<Media caption={caption} size={size} align={align}>
					<video controls style={styles.video}>
						<source src={url} type="video/mp4"/>
					</video>
				</Media>);
		}
		return html;
	}
});


styles = {
	video: {
		width: '100%',
		height: '100%'
	}
};


export default createPubPubPlugin(VideoPlugin, VideoConfig, VideoInputFields);
