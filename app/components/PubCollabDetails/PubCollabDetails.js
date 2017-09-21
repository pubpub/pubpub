import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';

require('./pubCollabDetails.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	isLoading: false,
};

class PubCollabDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasUpdated: false,
			title: props.pubData.title,
			slug: props.pubData.slug,
			description: props.pubData.description || '',
		};
		this.updateTitle = this.updateTitle.bind(this);
		this.updateSlug = this.updateSlug.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
		this.handleSave = this.handleSave.bind(this);
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
			slug: evt.target.value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase()
		});
	}
	updateDescription(evt) {
		this.setState({
			hasUpdated: true,
			description: evt.target.value.substring(0, 280).replace(/\n/g, ' ')
		});
	}
	handleSave() {
		this.props.onSave({
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
		});
	}

	render() {
		return (
			<div className={'pub-collab-details'}>
				<div className={'save-button-wrapper'}>
					<Button
						text={'Save Details'}
						className={'pt-intent-primary'}
						onClick={this.handleSave}
						loading={this.props.isLoading}
						disabled={!this.state.hasUpdated || !this.state.title || !this.state.slug}
					/>
				</div>
				<h5>Pub Details</h5>
				<InputField
					label={'Title'}
					value={this.state.title}
					onChange={this.updateTitle}
					error={!this.state.title ? 'Required' : null}
				/>
				<InputField
					label={'Link'}
					helperText={`Pub will be available at ${window.location.host}/pub/${this.state.slug}`}
					value={this.state.slug}
					onChange={this.updateSlug}
					error={!this.state.slug ? 'Required' : null}
				/>
				<InputField
					label={'Description'}
					placeholder={'Enter description'}
					helperText={`${this.state.description.length}/280 characters`}
					isTextarea={true}
					value={this.state.description}
					onChange={this.updateDescription}
					error={undefined}
				/>
			</div>
		);
	}
}

PubCollabDetails.propTypes = propTypes;
PubCollabDetails.defaultProps = defaultProps;
export default PubCollabDetails;
