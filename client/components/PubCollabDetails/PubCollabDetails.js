import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';

require('./pubCollabDetails.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	canDelete: PropTypes.bool,
	onSave: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	putIsLoading: PropTypes.bool,
	deleteIsLoading: PropTypes.bool,
};

const defaultProps = {
	canDelete: false,
	putIsLoading: false,
	deleteIsLoading: false,
};

class PubCollabDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasUpdated: false,
			title: props.pubData.title,
			slug: props.pubData.slug,
			description: props.pubData.description || '',
			avatar: props.pubData.avatar || '',
			useHeaderImage: props.pubData.useHeaderImage || false,
		};
		this.updateTitle = this.updateTitle.bind(this);
		this.updateSlug = this.updateSlug.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
		this.onAvatarChange = this.onAvatarChange.bind(this);
		this.onUseHeaderImageChange = this.onUseHeaderImageChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	updateTitle(evt) {
		this.setState({
			hasUpdated: true,
			title: evt.target.value
		});
	}
	updateSlug(evt) {
		this.setState({
			hasUpdated: true,
			slug: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase()
		});
	}
	updateDescription(evt) {
		this.setState({
			hasUpdated: true,
			description: evt.target.value.substring(0, 280).replace(/\n/g, ' ')
		});
	}
	onAvatarChange(val) {
		this.setState({
			hasUpdated: true,
			avatar: val
		});
	}
	onUseHeaderImageChange(evt) {
		this.setState({
			hasUpdated: true,
			useHeaderImage: evt.target.checked
		});
	}
	handleSave() {
		this.props.onSave({
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
			avatar: this.state.avatar,
			useHeaderImage: this.state.useHeaderImage,
		});
	}
	handleDelete() {
		this.props.onDelete(this.props.pubData.id);
	}

	render() {
		return (
			<div className="pub-collab-details-component">
				<div className="save-button-wrapper">
					<Button
						text="Save Details"
						className="pt-intent-primary"
						onClick={this.handleSave}
						loading={this.props.putIsLoading}
						disabled={!this.state.hasUpdated || !this.state.title || !this.state.slug}
					/>
				</div>
				<h5>Pub Details</h5>
				<InputField
					label="Title"
					value={this.state.title}
					onChange={this.updateTitle}
					error={!this.state.title ? 'Required' : null}
				/>
				<InputField
					label="Link"
					helperText={`Pub will be available at ${window.location.host}/pub/${this.state.slug}`}
					value={this.state.slug}
					onChange={this.updateSlug}
					error={!this.state.slug ? 'Required' : null}
				/>
				<InputField
					label="Description"
					placeholder="Enter description"
					helperText={`${this.state.description.length}/280 characters`}
					isTextarea={true}
					value={this.state.description}
					onChange={this.updateDescription}
					error={undefined}
				/>
				<ImageUpload
					htmlFor="avatar-upload"
					label="Pub Image"
					defaultImage={this.state.avatar}
					onNewImage={this.onAvatarChange}
					width={150}
					helperText="Suggested minimum dimensions: 1200px x 800px."
				/>
				<InputField label="Use Header Image">
					<Checkbox checked={this.state.useHeaderImage} onChange={this.onUseHeaderImageChange}>
						Set to use the pub image at the top of published snapshots.
					</Checkbox>
				</InputField>

				{this.props.canDelete &&
					<div className="pt-callout pt-intent-danger">
						<h5>Delete Pub</h5>
						<div>Deleting a Pub is permanent.</div>

						<div className="delete-button-wrapper">
							<Button
								type="button"
								className="pt-intent-danger"
								text="Delete Pub"
								loading={this.props.deleteIsLoading}
								onClick={this.handleDelete}
							/>
						</div>
					</div>
				}
			</div>
		);
	}
}

PubCollabDetails.propTypes = propTypes;
PubCollabDetails.defaultProps = defaultProps;
export default PubCollabDetails;
