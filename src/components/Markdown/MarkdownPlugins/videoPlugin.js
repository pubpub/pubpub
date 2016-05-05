import React, {PropTypes} from 'react';
import Media from './baseMediaPlugin';
import createPubPubPlugin from './PubPub';
import ErrorMsg from './ErrorPlugin';

const InputFields = [
	{title: 'source', type: 'asset', params: {assetType: 'video'}},
	{title: 'align', type: 'align'},
	{title: 'size', type: 'size'},
	{title: 'caption', type: 'textArea', params: {placeholder: 'Caption describing the video'}},
	{title: 'reference', type: 'reference'},

];

const Config = {
	title: 'video',
	inline: true,
	preview: true,
	autocomplete: true,
	color: 'rgba(158, 219, 176, 0.5)',
};

const VIDEO_WRAPPER_CLASS = 'pub-video-wrapper';
const VIDEO_CLASS = 'pub-video';

const EditorWidget = (inputProps) => (<span>Video: {(((inputProps.source) ? inputProps.source.label : false) || 'Empty')}</span>);


let styles = {};

const Plugin = React.createClass({
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

		if (!this.props.source || !this.props.source.url) {
			return (<span></span>);
		}
		const url = this.props.source.url;

		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;


		if (this.props.error === 'empty') {
			html = <span></span>;
		} else if (this.props.error === 'type') {
			html = <ErrorMsg>Could not find video asset.</ErrorMsg>;
		} else {
			html = (
				<Media className={VIDEO_WRAPPER_CLASS} caption={caption} size={size} align={align}>
					<video className={VIDEO_CLASS} controls style={styles.video}>
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


export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
