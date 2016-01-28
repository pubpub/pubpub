import React, {PropTypes} from 'react';
import ImageLoader from 'react-imageloader';
import Media from './baseMediaPlugin';
import createPubPubPlugin from './PubPub';

const ImageInputFields = [
	{title: 'source', type: 'asset', params: {assetType: 'image'}},
	{title: 'align', type: 'align'},
	{title: 'size', type: 'size'},
	{title: 'caption', type: 'text', params: {placeholder: 'Caption describing the image'}},
	{title: 'reference', type: 'reference'},

];

const ImageConfig = {
	title: 'image',
	inline: true,
	autocomplete: true
};

// let styles = {};

const ImagePlugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
		size: React.PropTypes.oneOfType([React.PropTypes.oneOf(['small', 'medium', 'large']), React.PropTypes.number]),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		caption: PropTypes.string,
		source: PropTypes.object,
		reference: PropTypes.object
	},
	getInitialState: function() {
		return {};
	},
	preloader: function() {
		let result;
		result = <span>loading</span>;
		return result;
	},
	loadedImage: function() {
		return;
	},
	render: function() {
		// const refName = this.props.children;
		if (!this.props.source || !this.props.source.url_s3) {
			return (<span></span>);
		}
		const url = this.props.source.url_s3;
		const size = this.props.size;
		const align = this.props.align;
		const caption = this.props.caption;
		const reference = this.props.reference;

		const imgProps = {style: {width: '100%', height: '100%'}};

		return (<Media caption={caption} size={size} align={align} reference={reference}>
				<ImageLoader onLoad={this.loadedImage} imgProps={imgProps} src={url} wrapper={React.DOM.span} preloader={this.preloader}/>
			</Media>
		);
	}
});

export default createPubPubPlugin(ImagePlugin, ImageConfig, ImageInputFields);
