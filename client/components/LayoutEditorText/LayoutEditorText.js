import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import InsertMenu from '@pubpub/editor/addons/InsertMenu';
import { s3Upload, getResizedUrl } from 'utilities';

require('./layoutEditorText.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* title, align, width, text */
};

class LayoutEditorText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: new Date().getTime(),
		};
		this.handleRemove = this.handleRemove.bind(this);
		this.setAlignLeft = this.setAlignLeft.bind(this);
		this.setAlignCenter = this.setAlignCenter.bind(this);
		this.setWidthNarrow = this.setWidthNarrow.bind(this);
		this.setWidthWide = this.setWidthWide.bind(this);
		this.setText = this.setText.bind(this);
		this.changeTitle = this.changeTitle.bind(this);
	}
	handleRemove() {
		this.props.onRemove(this.props.layoutIndex);
	}
	setAlignLeft() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: 'left'
		});
	}
	setAlignCenter() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: 'center'
		});
	}
	setWidthNarrow() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			width: 'narrow'
		});
	}
	setWidthWide() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			width: 'wide'
		});
	}
	setText(textJSON) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			text: textJSON,
		});
	}
	changeTitle(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			title: evt.target.value,
		});
	}
	render() {
		const wrapperStyle = {
			textAlign: this.props.content.align || 'left',
			maxWidth: this.props.content.width === 'narrow' ? '800px' : 'none',
			margin: this.props.content.align === 'center' && this.props.content.width === 'narrow' ? '0 auto' : '0',
		};
		return (
			<div className="layout-editor-text-component">
				<div className="block-header">
					<div className="pt-form-group">
						<label htmlFor={`section-title-${this.props.layoutIndex}`}>Text Section Title</label>
						<input id={`section-title-${this.props.layoutIndex}`} type="text" className="pt-input" value={this.props.content.title} onChange={this.changeTitle} />
					</div>
					<div className="spacer" />
					<div className="pt-form-group">
						<label htmlFor={`section-size-${this.props.layoutIndex}`}>Align</label>
						<div className="pt-button-group">
							<button className={`pt-button ${this.props.content.align === 'left' ? 'pt-active' : ''}`} onClick={this.setAlignLeft}>Left</button>
							<button className={`pt-button ${this.props.content.align === 'center' ? 'pt-active' : ''}`} onClick={this.setAlignCenter}>Center</button>
						</div>
					</div>
					<div className="pt-form-group">
						<label htmlFor={`section-limit-${this.props.layoutIndex}`}>Width</label>
						<div className="pt-button-group">
							<button className={`pt-button ${this.props.content.width === 'narrow' ? 'pt-active' : ''}`} onClick={this.setWidthNarrow}>Narrow</button>
							<button className={`pt-button ${this.props.content.width === 'wide' ? 'pt-active' : ''}`} onClick={this.setWidthWide}>Wide</button>
						</div>
					</div>
					<div className="pt-form-group">
						<div className="pt-button-group">
							<button className="pt-button pt-icon-trash" onClick={this.handleRemove} />
						</div>
					</div>
				</div>

				<div className="block-content">
					<div className="container">
						{this.props.content.title &&
							<div className="row">
								<div className="col-12">
									<h3>{this.props.content.title}</h3>
								</div>
							</div>
						}

						<div className="row">
							<div className="col-12">
								<div style={wrapperStyle}>
									<Editor
										placeholder="Enter text..."
										onChange={this.setText}
										initialContent={this.props.content.text || undefined}
										editorId={String(this.state.key)}
									>
										<FormattingMenu />
										<InsertMenu />
										<Iframe />
										<Image
											handleFileUpload={s3Upload}
											handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '1200x0'); }}
										/>
										<Video handleFileUpload={s3Upload} />
										<File handleFileUpload={s3Upload} />

									</Editor>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);	
	}
}

LayoutEditorText.propTypes = propTypes;
export default LayoutEditorText;
