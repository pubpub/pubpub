import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
// import { Link } from 'react-router-dom';
// import Avatar from 'components/Avatar/Avatar';
import { Editor } from '@pubpub/editor';
import Latex from '@pubpub/editor/addons/Latex';

require('./discussionInput.scss');

const propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	showTitle: PropTypes.bool,
};

const defaultProps = {
	showTitle: false,
};

class DiscussionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			content: '',
		};
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onReplyChange = this.onReplyChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.focusEditor = this.focusEditor.bind(this);
		this.editorRef = undefined;
	}

	onTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}

	onReplyChange(val) {
		this.setState({ content: val });
	}

	onSubmit(evt) {
		evt.preventDefault();
		this.props.handleSubmit({
			content: this.state.content,
			title: this.state.title
		});
	}

	focusEditor() {
		this.editorRef.focus();
	}

	render() {
		const stuff = {
			type: 'doc',
			attrs: { meta: {} },
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello everyone!'
						}
					]
				}
			]
		};
		return (
			<div className={'discussion-input'}>
				{this.props.showTitle &&
					<input
						className="title-input"
						placeholder={'New Discussion Title...'}
						value={this.state.title}
						onChange={this.onTitleChange}
					/>
				}
				<div className={'input-text'} onClick={this.focusEditor} tabIndex={-1} role={'textbox'}>
					<Editor
						ref={(ref)=> { this.editorRef = ref; }}
						placeholder={'Reply...'}
						onChange={this.onReplyChange}
						initialContent={stuff}
					/>
				</div>
				<div className={'buttons'}>
					<div className={'buttons-left'}>
						<button type={'button'} className={'pt-button pt-minimal pt-small'}>Attach</button>
						<button type={'button'} className={'pt-button pt-minimal pt-small'}>Format</button>
					</div>
					<div className={'buttons-right'}>
						<button type={'button'} className={'pt-button pt-minimal pt-small pt-icon-globe'} />
						<Button
							name={'submit'}
							type={'submit'}
							className={'pt-button pt-intent-primary pt-small'}
							onClick={this.onSubmit}
							text={'Submit Reply'}
							disabled={!this.state.content}
							loading={false}
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
