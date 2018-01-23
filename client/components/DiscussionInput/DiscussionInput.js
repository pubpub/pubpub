import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import HighlightQuote from '@pubpub/editor/addons/HighlightQuote';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';
import FormattingHelp from 'components/FormattingHelp/FormattingHelp';

require('./discussionInput.scss');

const propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	showTitle: PropTypes.bool,
	initialContent: PropTypes.object,
	submitIsLoading: PropTypes.bool,
	getHighlightContent: PropTypes.func,
};

const defaultProps = {
	showTitle: false,
	initialContent: undefined,
	submitIsLoading: false,
	getHighlightContent: undefined,
};

class DiscussionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			body: '',
			isPublic: true,
			submitDisabled: true,
			key: new Date().getTime(),
		};
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onBodyChange = this.onBodyChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.editorRef = undefined;
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.submitIsLoading && !nextProps.submitIsLoading) {
			this.setState({
				key: new Date().getTime()
			});
		}
	}
	onTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}

	onBodyChange(val) {
		this.setState({
			body: val,
			submitDisabled: !this.editorRef.view.state.doc.textContent,
		});
	}

	onSubmit(evt) {
		evt.preventDefault();
		const highlights = this.editorRef.view.state.doc.content.content.filter((item)=> {
			return item.type.name === 'highlightQuote';
		}).map((item)=> {
			return item.attrs;
		});
		this.props.handleSubmit({
			title: this.state.title,
			content: this.state.body,
			text: this.editorRef.view.state.doc.textContent,
			isPublic: this.state.isPublic,
			highlights: highlights.length ? highlights : undefined,
		});
	}

	render() {
		return (
			<div className="discussion-input-component">
				{this.props.showTitle &&
					<input
						className="title-input"
						placeholder="Add Discussion Title..."
						value={this.state.title}
						onChange={this.onTitleChange}
					/>
				}
				<div className="input-text" tabIndex={-1} role="textbox">
					<Editor
						key={this.state.key}
						ref={(ref)=> { this.editorRef = ref; }}
						placeholder="Reply..."
						onChange={this.onBodyChange}
						initialContent={this.props.initialContent}
						editorId={String(this.state.key)}
					>
						<FormattingMenu include={['link']} />
						<HighlightQuote
							getHighlightContent={this.props.getHighlightContent}
							containerId={`pubpub-editor-container-${this.state.key}`}
						/>
					</Editor>
				</div>
				<div className="buttons">
					<div className="buttons-left">
						{/* <button type="button" className="pt-button pt-minimal pt-small">Attach</button> */}
						<Popover
							content={<FormattingHelp />}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.TOP_LEFT}
							popoverClassName="pt-minimal"
							transitionDuration={-1}
							inheritDarkTheme={false}
						>
							<button type="button" className="pt-button pt-minimal pt-small">Format</button>
						</Popover>

					</div>
					<div className="buttons-right">
						{this.props.showTitle &&
							<Popover
								content={
									<div className="pt-menu">
										<DropdownRichItem
											title="Public"
											description="Visible to the public."
											icon="pt-icon-globe"
											onClick={()=>{ this.setState({ isPublic: true }); }}
											hideBottomBorder={false}
										/>
										<DropdownRichItem
											title="Private"
											description="Visible to those with view, edit, or manage permissions."
											icon="pt-icon-lock2"
											onClick={()=>{ this.setState({ isPublic: false }); }}
											hideBottomBorder={true}
										/>
									</div>
								}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.TOP_RIGHT}
								popoverClassName="pt-minimal"
								transitionDuration={-1}
								inheritDarkTheme={false}
							>
								<button type="button" className={`pt-button pt-minimal pt-small ${this.state.isPublic ? 'pt-icon-globe' : 'pt-icon-lock2'}`} />
							</Popover>
						}

						<Button
							name="submit"
							type="submit"
							className="pt-button pt-intent-primary pt-small"
							onClick={this.onSubmit}
							text={this.props.showTitle ? 'Submit Discussion' : 'Submit Reply'}
							disabled={this.state.submitDisabled}
							loading={this.props.submitIsLoading}
						/>
					</div>
				</div>
			</div>
		);
	}
}

DiscussionInput.propTypes = propTypes;
DiscussionInput.defaultProps = defaultProps;
export default DiscussionInput;
