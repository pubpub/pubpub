import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import InsertMenu from '@pubpub/editor/addons/InsertMenu';
import { s3Upload, getResizedUrl } from 'utilities';

// require('./layoutEditorText.scss');

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
			maxWidth: this.props.content.width === 'narrow' ? '800px' : 'auto',
			margin: this.props.content.align === 'center' && this.props.content.width === 'narrow' ? '0 auto' : '0',
		}
		return (
			<div className={'layout-editor-text'}>
				<div className={'block-header'}>
					<input type={'text'} className={`pt-input`} value={this.props.content.title} onChange={this.changeTitle} />
					<div className={'pt-button-group'}>
						<button className={`pt-button ${this.props.content.align === 'left' ? 'pt-active' : ''}`} onClick={this.setAlignLeft}>Left</button>
						<button className={`pt-button ${this.props.content.align === 'center' ? 'pt-active' : ''}`} onClick={this.setAlignCenter}>Center</button>
					</div>
					<div className={'pt-button-group'}>
						<button className={`pt-button ${this.props.content.width === 'narrow' ? 'pt-active' : ''}`} onClick={this.setWidthNarrow}>Narrow</button>
						<button className={`pt-button ${this.props.content.width === 'wide' ? 'pt-active' : ''}`} onClick={this.setWidthWide}>Wide</button>
					</div>
					<button className={`pt-button pt-icon-trash`} onClick={this.handleRemove} />
				</div>

				<div className={'block-content'}>
					<div style={wrapperStyle}>
						<Editor
							placeholder={'Enter text...'}
							onChange={this.setText}
							initialContent={this.props.content.text || undefined}
						>
							<FormattingMenu />
							<InsertMenu />
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
		);	
	}
}

LayoutEditorText.propTypes = propTypes;
export default LayoutEditorText;
