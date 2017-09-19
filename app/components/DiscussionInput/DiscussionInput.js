import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';

require('./discussionInput.scss');

const propTypes = {
	handleReplySubmit: PropTypes.func.isRequired,
};

const defaultProps = {
	isPresentation: false,
};

class DiscussionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
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
			<form onSubmit={this.onReplySubmit}>
				<input
					className="pt-input"
					placeholder={'Reply...'}
					value={this.state.content}
					onChange={this.onReplyChange}
				/>
				<button onClick={this.onReplySubmit} type={'submit'} className={'pt-button pt-intent-primary pt-small'}>Submit</button>
			</form>
		);
	}
}

DiscussionInput.propTypes = propTypes;
DiscussionInput.defaultProps = defaultProps;
export default DiscussionInput;
