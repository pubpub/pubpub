import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
// import { Link } from 'react-router-dom';
// import Avatar from 'components/Avatar/Avatar';

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
	}

	onTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}

	onReplyChange(evt) {
		this.setState({ content: evt.target.value });
	}

	onSubmit(evt) {
		evt.preventDefault();
		this.props.handleSubmit({
			content: this.state.content,
			title: this.state.title
		});
	}

	render() {
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
				<textarea
					className="input"
					placeholder={'Reply...'}
					value={this.state.content}
					onChange={this.onReplyChange}
				/>
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
