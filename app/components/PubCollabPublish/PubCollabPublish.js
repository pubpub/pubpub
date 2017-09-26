import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';

require('./pubCollabPublish.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onOpenDetails: PropTypes.func,
	onPublish: PropTypes.func,
	onPutPub: PropTypes.func,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	onOpenDetails: ()=>{},
	onPublish: ()=>{},
	onPutPub: ()=>{},
	isLoading: false,
};

class PubCollabPublish extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collaborationMode: props.pubData.collaborationMode,
		};
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
	}
	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		this.props.onPutPub({
			collaborationMode: value,
		});
	}
	render() {
		return (
			<div className={'pub-collab-publish'}>
				<h5>Publish Snapshot</h5>
				<div>Publishing a snapshot creates a publicly available version of your document at its current state.</div>

				<h6>Publication URL</h6>
				<div className={'input'}>https://{window.location.hostname}/pub/{this.props.pubData.slug}</div>
				<div className={'details'}>Use the <span tabIndex={-1} role={'button'} onClick={this.props.onOpenDetails}>details panel</span> to change this url</div>

				<div className={'wrapper'}>
					<PubCollabDropdownPrivacy
						value={this.state.collaborationMode}
						onChange={this.handleCollaborationModeChange}
					/>
				</div>

				<div className={'button-wrapper'}>
					<Button
						onClick={this.props.onPublish}
						className={'pt-intent-primary'}
						text={'Publish Snapshot'}
						loading={this.props.isLoading}
					/>
				</div>

			</div>
		);
	}
}

PubCollabPublish.propTypes = propTypes;
PubCollabPublish.defaultProps = defaultProps;
export default PubCollabPublish;
