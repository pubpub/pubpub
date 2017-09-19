import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
// import { Link } from 'react-router-dom';
// import Avatar from 'components/Avatar/Avatar';

require('./discussionInput.scss');

const propTypes = {
	handleReplySubmit: PropTypes.func.isRequired,
	showTitle: PropTypes.bool,
};

const defaultProps = {
	showTitle: false,
};

class DiscussionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: undefined,
		};
		this.onReplyChange = this.onReplyChange.bind(this);
		this.onReplySubmit = this.onReplySubmit.bind(this);
	}

	onReplyChange(evt) {
		this.setState({ content: evt.target.value });
	}

	onReplySubmit(evt) {
		evt.preventDefault();
		this.props.handleReplySubmit(this.state.content);
	}

	render() {
		return (
			<div className={'discussion-input'}>
				{this.props.showTitle &&
					<div className={'title-input'}>
						New Discussion
					</div>
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
							onClick={this.onReplySubmit}
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
