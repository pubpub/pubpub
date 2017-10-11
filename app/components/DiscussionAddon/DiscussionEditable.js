import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnchorButton } from '@blueprintjs/core';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionAutocomplete from './DiscussionAutocomplete';

require('./discussionAddon.scss');

const propTypes = {
	// node: PropTypes.object,
	// view: PropTypes.object,
	align: PropTypes.oneOf(['full', 'left', 'right', 'center']).isRequired,
	isSelected: PropTypes.bool,
	threads: PropTypes.array,
	threadNumber: PropTypes.number,
	updateAttrs: PropTypes.func.isRequired,
	routerContext: PropTypes.object,
};

const defaultProps = {
	node: {},
	isSelected: false,
	view: {},
	threads: [],
	threadNumber: null,
	routerContext: {},
};

const childContextTypes = {
	router: PropTypes.object,
};

class DiscussionEditable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDialog: false,
			isResizing: false,
			uploading: false,
			localURL: null,
		};
		this.randKey = Math.round(Math.random() * 99999);
		// this.onDragMouseDown = this.onDragMouseDown.bind(this);
		// this.onDragMouseUp = this.onDragMouseUp.bind(this);
		// this.onMouseMove = this.onMouseMove.bind(this);
		// this.updateCaption = this.updateCaption.bind(this);
		this.updateAlign = this.updateAlign.bind(this);
		this.handleDiscussionSelect = this.handleDiscussionSelect.bind(this);
		// this.setBlob = this.setBlob.bind(this);
		// this.onUploadFinish = this.onUploadFinish.bind(this);
	}

	getChildContext() {
		return { router: this.props.routerContext };
	}

	// onDragMouseDown(evt) {
	// 	const handle = evt.target.className.replace('drag-handle ', '');
	// 	this.setState({ isResizing: handle });
	// 	document.addEventListener('mousemove', this.onMouseMove);
	// 	document.addEventListener('mouseup', this.onDragMouseUp);
	// }
	// onDragMouseUp() {
	// 	this.setState({ isResizing: false });
	// 	document.removeEventListener('mousemove', this.onMouseMove);
	// 	document.removeEventListener('mouseup', this.onDragMouseUp);
	// }
	// onMouseMove(evt) {
	// 	const videoBounding = this.videoElem.getBoundingClientRect();
	// 	const delta = this.state.isResizing === 'left'
	// 		? videoBounding.left - evt.clientX
	// 		: evt.clientX - videoBounding.right;
	// 	const maxWidth = this.rootElem.clientWidth;
	// 	const currentWidth = videoBounding.width;
	// 	const nextSize = Math.min(
	// 		Math.max(
	// 			Math.round(((currentWidth + delta) / maxWidth) * 100),
	// 			20
	// 		),
	// 		100
	// 	);
	// 	this.props.updateAttrs({ size: nextSize });
	// }
	// updateCaption(evt) {
	// 	this.props.updateAttrs({ caption: evt.target.value });
	// }
	updateAlign(val) {
		this.props.updateAttrs({ align: val });
	}
	handleDiscussionSelect(thread) {
		// if (evt.target.files.length) {
		// 	this.props.onFileUpload(evt.target.files[0], ()=>{}, this.onUploadFinish, 0);
		// 	this.setState({
		// 		uploading: true,
		// 	});
		// 	this.setBlob(evt.target.files[0]);
		// }
		// console.log('Selected', thread);
		this.props.updateAttrs({ threadNumber: thread[0].threadNumber });
	}
	// setBlob(video) {
	// 	// const reader = new FileReader();
	// 	// reader.onload = (localURL)=> {
	// 		// this.setState({ localURL: localURL.target.result });
	// 	// };
	// 	// reader.readAsDataURL(image);
	// 	this.setState({ localURL: URL.createObjectURL(video) });
	// }
	// onUploadFinish(evt, index, type, filename) {
	// 	this.setState({ uploading: false });
	// 	this.props.updateAttrs({ url: `https://assets.pubpub.org/${filename}` });
	// }
	render() {
		const alignOptions = [
			{ key: 'left', icon: 'pt-icon-align-left' },
			{ key: 'center', icon: 'pt-icon-align-center' },
			{ key: 'right', icon: 'pt-icon-align-right' },
			{ key: 'full', icon: 'pt-icon-vertical-distribution' },
		];
		const figFloat = this.props.align === 'left' || this.props.align === 'right' ? this.props.align : 'none';
		let figMargin = '0em auto 1em';
		if (this.props.align === 'left') { figMargin = '1em 1em 1em 0px'; }
		if (this.props.align === 'right') { figMargin = '1em 0px 1em 1em'; }
		const figWidth = this.props.align === 'full' ? '100%' : '60%';
		const figStyle = {
			width: figWidth,
			margin: figMargin,
			float: figFloat,
		};

		const activeThread = this.props.threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === this.props.threadNumber) {
				return curr;
			}
			return prev;
		}, undefined);

		return (
			<div className={'editable discussion-figure-wrapper'} ref={(rootElem)=> { this.rootElem = rootElem; }}>
				<figure className={`discussion pt-card pt-elevation-2 ${this.props.isSelected ? 'isSelected' : ''}`} style={figStyle}>
					{activeThread &&
						<DiscussionPreview
							key={`thread-${activeThread[0].id}`}
							discussions={activeThread}
							slug={'pubData.slug'}
							isPresentation={false}
						/>
					}
					{!activeThread &&
						<label htmlFor={`new-${this.randKey}`} className={'empty-video pt-elevation-0'}>
							<AnchorButton
								className={'pt-large pt-icon-chat pt-minimal'}
								text={'Click to choose discussion'}
								loading={this.state.uploading}
							/>
							<DiscussionAutocomplete
								threads={this.props.threads}
								onSelect={this.handleDiscussionSelect}
							/>
						</label>
					}
					{this.props.isSelected && activeThread &&
						<div className={'options-wrapper'}>
							<div className={'top-row'}>
								<div className={'pt-button-group pt-minimal'}>
									{alignOptions.map((item)=> {
										return (
											<button
												key={`align-option-${item.key}`}
												className={`pt-button ${item.icon} ${this.props.align === item.key ? 'pt-active' : ''}`}
												onClick={()=> { this.updateAlign(item.key); }}
											/>
										);
									})}
								</div>
								{/*<div className={'right-wrapper'}>
																	<label htmlFor={this.randKey} className={'file-select'}>
																		<AnchorButton
																			text={'Choose new discussion'}
																			loading={this.state.uploading}
																		/>
																	</label>
																</div>*/}
							</div>
							<DiscussionAutocomplete
								threads={this.props.threads}
								onSelect={this.handleDiscussionSelect}
							/>
						</div>
					}
				</figure>
			</div>
		);
	}
}

DiscussionEditable.propTypes = propTypes;
DiscussionEditable.defaultProps = defaultProps;
DiscussionEditable.childContextTypes = childContextTypes;
export default DiscussionEditable;
