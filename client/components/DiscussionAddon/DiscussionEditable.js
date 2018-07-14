import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';
import DiscussionAutocomplete from './DiscussionAutocomplete';

require('./discussionAddon.scss');

const propTypes = {
	// node: PropTypes.object,
	view: PropTypes.object,
	align: PropTypes.oneOf(['full', 'left', 'right', 'center']).isRequired,
	isSelected: PropTypes.bool,
	threads: PropTypes.array,
	slug: PropTypes.string.isRequired,
	threadNumber: PropTypes.number,
	updateAttrs: PropTypes.func.isRequired,
	onOptionsRender: PropTypes.func.isRequired,
	optionsContainerRef: PropTypes.object.isRequired,
};

const defaultProps = {
	node: {},
	isSelected: false,
	view: {},
	threads: [],
	threadNumber: null,
};


class DiscussionEditable extends Component {
	constructor(props) {
		super(props);
		// this.state = {
		// 	openDialog: false,
		// 	isResizing: false,
		// 	uploading: false,
		// 	localURL: null,
		// };
		this.randKey = Math.round(Math.random() * 99999);
		this.updateAlign = this.updateAlign.bind(this);
		this.handleDiscussionSelect = this.handleDiscussionSelect.bind(this);
		this.portalRefFunc = this.portalRefFunc.bind(this);
	}

	updateAlign(val) {
		this.props.updateAttrs({ align: val });
	}

	handleDiscussionSelect(thread) {
		this.props.updateAttrs({ threadNumber: thread[0].threadNumber });
	}

	portalRefFunc(elem) {
		/* Used to call onOptioneRender so that optionsBox can be placed */
		if (elem) {
			const domAtPos = this.props.view.domAtPos(this.props.view.state.selection.from);
			const nodeDom = domAtPos.node.childNodes[domAtPos.offset];
			this.props.onOptionsRender(nodeDom, this.props.optionsContainerRef.current);
		}
	}

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
			<div className="editable discussion-figure-wrapper" ref={(rootElem)=> { this.rootElem = rootElem; }}>
				<figure className={`discussion pt-card pt-elevation-2 ${this.props.isSelected ? 'isSelected' : ''}`} style={figStyle}>
					{activeThread &&
						<DiscussionPreview
							key={`thread-${activeThread[0].id}`}
							discussions={activeThread}
							slug={this.props.slug}
							// isPresentation={true}
						/>
					}
					{!activeThread &&
						<label htmlFor={`new-${this.randKey}`} className="empty-discussion pt-elevation-0">
							<DiscussionAutocomplete
								threads={this.props.threads}
								onSelect={this.handleDiscussionSelect}
							/>
						</label>
					}
					{/*this.props.isSelected && activeThread &&
						<div className="options-wrapper">
							<div className="top-row">
								<div className="pt-button-group pt-minimal">
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
							</div>
							<DiscussionAutocomplete
								threads={this.props.threads}
								onSelect={this.handleDiscussionSelect}
								placeholder="Change discussion thread"
							/>
						</div>
					*/}
				</figure>
				{this.props.isSelected && activeThread &&
					<Portal 
						ref={this.portalRefFunc} 
						node={this.props.optionsContainerRef.current}
					>
						<div className="options-box">
							<div className="options-title">Discussion Details</div>
							
							{/*  Alignment Adjustment */}
							<label className="form-label">
								Alignment
							</label>
							<div className="pt-button-group pt-fill">
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
							
							{/*  Thread Selection */}
							<label className="form-label">
								Thread Selection
							</label>
							<DiscussionAutocomplete
								threads={this.props.threads}
								onSelect={this.handleDiscussionSelect}
								placeholder="Change discussion thread"
							/>
							
						</div>
					</Portal>
				}
			</div>
		);
	}
}

DiscussionEditable.propTypes = propTypes;
DiscussionEditable.defaultProps = defaultProps;
export default DiscussionEditable;
