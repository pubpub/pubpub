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
		this.handlePublish = this.handlePublish.bind(this);
	}
	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		this.props.onPutPub({
			collaborationMode: value,
		});
	}
	handlePublish() {
		this.props.onPublish();
	}
	render() {
		const isUnlisted = this.props.pubData.collections.reduce((prev, curr)=> {
			if (curr.isPublic) { return false; }
			return prev;
		}, true);

		return (
			<div className="pub-collab-publish-component">
				<h5>Publish</h5>
				<div>Publishing creates a snapshot of the current working draft. This snapshot will be publicly available.</div>

				<h6>Publication URL</h6>
				<div className="input">https://{window.location.hostname}/pub/{this.props.pubData.slug}</div>
				<div className="details">Use the <span tabIndex={-1} role="button" onClick={this.props.onOpenDetails}>details panel</span> to change this URL.</div>

				<div className="wrapper">
					<h6>Working Draft Privacy</h6>
					<PubCollabDropdownPrivacy
						value={this.state.collaborationMode}
						onChange={this.handleCollaborationModeChange}
					/>
				</div>

				{isUnlisted &&
					<div className="pt-callout pt-intent-danger">
						<h5>Pub will be Unlisted</h5>
						<div>This pub is only included in Private collections. When published, it will be publicly available but will be unlisted.</div>
						<div>Anyone with the link will be able to view the published snapshot, but it will not show up in search results, rss feds, or search engines.</div>
					</div>
				}
				<div className="button-wrapper">
					<Button
						onClick={this.handlePublish}
						className="pt-intent-primary"
						text="Publish Snapshot"
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
