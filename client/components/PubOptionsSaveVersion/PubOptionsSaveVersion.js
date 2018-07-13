import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';
import { apiFetch } from 'utilities';

require('./pubOptionsSaveVersion.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	setOptionsMode: PropTypes.func.isRequired,
	setPubData: PropTypes.func.isRequired,
	editorRefNode: PropTypes.object.isRequired,
};

class PubOptionsSaveVersion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collaborationMode: props.pubData.collaborationMode,
			isLoading: false,
		};
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
		this.handlePublish = this.handlePublish.bind(this);
	}

	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		const newValues = {
			collaborationMode: value,
		};

		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...newValues,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				...newValues
			});
		})
		.catch((err)=> {
			console.error('Error Saving: ', err);
		});
	}

	handlePublish() {
		this.setState({ isLoading: true });
		const sectionsData = this.props.pubData.sectionsData;
		const editorRefs = sectionsData.map((item)=> {
			return `${this.props.pubData.editorKey}/${item.id}`;
		});

		this.props.editorRefNode.getCollabJSONs(editorRefs)
		.then((content)=> {
			const newContent = content.length === 1
				? content[0]
				: content.map((item, index)=> {
					return {
						title: sectionsData[index].title,
						id: sectionsData[index].id,
						content: item,
					};
				});
			return apiFetch('/api/versions', {
				method: 'POST',
				body: JSON.stringify({
					pubId: this.props.pubData.id,
					communityId: this.props.communityData.id,
					content: newContent,
					// submitHash: submitHash,
				})
			});
		})
		.then(()=> {
			window.location.href = `/pub/${this.props.locationData.params.slug}`;
		})
		.catch((err)=> {
			console.log('Error Publishing', err);
			this.setState({ isLoading: false });
		});
	}

	render() {
		const isUnlisted = this.props.pubData.collections.reduce((prev, curr)=> {
			if (curr.isPublic) { return false; }
			return prev;
		}, true);

		if (!this.props.editorRefNode) { return null; }

		return (
			<div className="pub-options-save-version-component">
				<h1>Save Version</h1>
				<div>Publishing creates a snapshot of the current working draft. This snapshot will be publicly available.</div>

				<h6>Publication URL</h6>
				<div className="input">https://{window.location.hostname}/pub/{this.props.pubData.slug}</div>
				<div className="details">Use the <span tabIndex={-1} role="button" onClick={()=> { this.props.setOptionsMode('details'); }}>details panel</span> to change this URL.</div>

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
						text="Save Version"
						loading={this.state.isLoading}
					/>
				</div>

			</div>
		);
	}
}

PubOptionsSaveVersion.propTypes = propTypes;
export default PubOptionsSaveVersion;
