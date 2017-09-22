import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

require('./pubCollabPublish.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onPublish: PropTypes.func,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	onPublish: ()=>{},
	isLoading: false,
};

class PubCollabPublish extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={'pub-collab-publish'}>
				<h5>Publish Snapshot</h5>
				<Button
					onClick={this.props.onPublish}
					className={'pt-intent-primary'}
					text={'Publish Snapshot'}
					loading={this.props.isLoading}
				/>
			</div>
		);
	}
}

PubCollabPublish.propTypes = propTypes;
PubCollabPublish.defaultProps = defaultProps;
export default PubCollabPublish;
