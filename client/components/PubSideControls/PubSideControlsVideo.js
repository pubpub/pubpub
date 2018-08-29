import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider, AnchorButton } from '@blueprintjs/core';
import SimpleEditor from 'components/SimpleEditor/SimpleEditor';
import { s3Upload } from 'utilities';

const propTypes = {
	attrs: PropTypes.object.isRequired,
	updateAttrs: PropTypes.func.isRequired,
};

class PubSideControlsVideo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUploading: false,
		};
		this.randKey = Math.round(Math.random() * 99999);
		this.onUploadFinish = this.onUploadFinish.bind(this);
		this.handleVideoSelect = this.handleVideoSelect.bind(this);
	}

	onUploadFinish(evt, index, type, filename) {
		/* This timeout is due to S3 returning a 404 if we render the */
		/* video immediately after upload. S3 seems to have read-after-write */
		/* consistency - but I am still seeing problems with it. 500ms */
		/* seems to do the trick, but this is pretty hand-wavy. */
		setTimeout(()=> {
			this.props.updateAttrs({ url: `https://assets.pubpub.org/${filename}` });
			this.setState({
				isUploading: false,
			});
		}, 500);
	}

	handleVideoSelect(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onUploadFinish, 0);
			this.setState({
				isUploading: true,
			});
		}
	}

	render() {
		const alignOptions = [
			{ key: 'left', icon: 'pt-icon-align-left' },
			{ key: 'center', icon: 'pt-icon-align-center' },
			{ key: 'right', icon: 'pt-icon-align-right' },
			{ key: 'full', icon: 'pt-icon-vertical-distribution' },
		];
		return (
			<div className="pub-side-controls-video-component">
				<div className="options-title">Video Details</div>
				{/*  Size Adjustment */}
				<div className="form-label first">
					Size
				</div>
				<Slider
					min={25}
					max={100}
					value={this.props.attrs.size}
					onChange={(newSize)=> {
						this.props.updateAttrs({ size: newSize });
					}}
					labelRenderer={false}
					disabled={this.props.attrs.align === 'full'}
					// labelRenderer={(val)=> { return `${val}%`; }}
					// labelStepSize={100}
				/>

				{/*  Alignment Adjustment */}
				<div className="form-label">
					Alignment
				</div>
				<div className="pt-button-group pt-fill">
					{alignOptions.map((item)=> {
						return (
							<button
								type="button"
								key={`align-option-${item.key}`}
								className={`pt-button ${item.icon} ${this.props.attrs.align === item.key ? 'pt-active' : ''}`}
								onClick={()=> { this.props.updateAttrs({ align: item.key }); }}
							/>
						);
					})}
				</div>

				{/*  Caption Adjustment */}
				<div className="form-label">
					Caption
				</div>
				<div className="simple-editor-wrapper">
					<SimpleEditor
						initialHtmlString={this.props.attrs.caption}
						onChange={(htmlString)=> {
							this.props.updateAttrs({ caption: htmlString });
						}}
						placeholder="Enter caption..."
					/>
				</div>

				{/*  Source Details */}
				<div className="form-label">
					Source
				</div>
				<div className="source-url">
					<a href={this.props.attrs.url} target="_blank" rel="noopener noreferrer">
						{this.props.attrs.url}
					</a>
				</div>

				{/* Select New  File */}
				<label htmlFor={this.randKey} className="file-select">
					<AnchorButton
						className="pt-button"
						text="Choose new video"
						loading={this.state.isUploading}
					/>
					<input
						id={this.randKey}
						name="video"
						type="file"
						accept="video/mp4, video/webm"
						onChange={this.handleVideoSelect}
						className="file-input"
					/>
				</label>
			</div>
		);
	}
}


PubSideControlsVideo.propTypes = propTypes;
export default PubSideControlsVideo;
