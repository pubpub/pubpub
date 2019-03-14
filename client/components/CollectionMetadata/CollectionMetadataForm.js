/**
 * The inner bits 'n' pieces of the form that lets you edit structured collection metadata, i.e. to create
 * a collection that represents a structured collection of content like a journal issue or book.
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	ButtonGroup,
	FormGroup,
	InputGroup,
	NonIdealState,
	Tag,
	MenuItem,
} from '@blueprintjs/core';

import collectionType from 'types/collection';

import { enumerateMetadataFields, normalizeMetadataToKind } from 'shared/collections/metadata';
import { getSchemaForKind } from 'shared/collections/schemas';
import { MultiSelect } from '@blueprintjs/select';

const propTypes = {
	collection: collectionType.isRequired,
	communityData: PropTypes.shape({}).isRequired,
	onUpdateMetadata: PropTypes.func.isRequired,
	onRequestDoi: PropTypes.func.isRequired,
};

class CollectionMetadataForm extends React.Component {
	constructor(props) {
		super(props);
		const kind = props.collection.kind;
		const initialMetadata = normalizeMetadataToKind(props.collection.metadata || {}, kind, {
			communityData: props.communityData,
			collection: props.collection,
		});
		this.state = {
			metadata: initialMetadata,
			kind: kind,
		};
		this.handleUpdateMetadataKind = this.handleUpdateMetadataKind.bind(this);
		this.handleRequestDoi = this.handleRequestDoi.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	handleInputChange(field, value) {
		const { metadata } = this.state;
		this.setState({
			metadata: {
				...metadata,
				[field]: value,
			},
		});
	}

	handleRevertMetadata() {
		const { initialMetadata } = this.state;
		this.setState({ metadata: initialMetadata });
	}

	handleUpdateMetadataKind(kind) {
		const { metadata } = this.state;
		this.setState({ metadata: normalizeMetadataToKind(metadata, kind) });
	}

	handleSave() {
		this.props.onUpdateMetadata(this.state.metadata);
	}

	hasUnsavedChanges() {
		return this.state.initialMetadata !== this.state.metadata;
	}

	handleRequestDoi() {
		this.setState({ requestedDoi: true });
		this.props.onRequestDoi();
	}

	renderField(field) {
		const { name, value, derived, isMulti } = field;
		if (isMulti) {
			return (
				<MultiSelect
					className="multi-select"
					items={value}
					selectedItems={value}
					createNewItemFromQuery={(t) => t}
					itemRenderer={(t) => <MenuItem text={t} />}
					tagRenderer={(t) => <Tag>{t}</Tag>}
				/>
			);
		}
		return (
			<InputGroup
				value={value || ''}
				disabled={derived}
				onChange={(event) => this.handleInputChange(name, event.target.value)}
			/>
		);
	}

	renderFields() {
		const { communityData, collection } = this.props;
		const { kind } = this.state;
		const metadata = normalizeMetadataToKind(this.state.metadata, kind, {
			communityData: communityData,
			collection: collection,
		});
		const fields = enumerateMetadataFields(metadata, kind);
		if (fields.length === 0) {
			return (
				<NonIdealState
					className="fields-empty-state"
					icon={getSchemaForKind(kind).bpDisplayIcon || 'help'}
					title="This collection type has no metadata"
				/>
			);
		}
		return (
			<div className="fields">
				{fields.map((field) => (
					<FormGroup key={field.name} label={field.label}>
						{this.renderField(field)}
					</FormGroup>
				))}
			</div>
		);
	}

	render() {
		const { collection } = this.props;
		const { requestedDoi } = this.state;
		return (
			<div className="collection-metadata-form-wrapper">
				{this.renderFields()}
				<ButtonGroup className="bottom-button-group">
					<Button
						icon="link"
						disabled={collection.doi}
						loading={requestedDoi && !collection.doi}
						onClick={this.handleRequestDoi}
					>
						Assign Crossref DOI
					</Button>
					<Button icon="tick" onClick={this.handleSave}>
						Save and close
					</Button>
				</ButtonGroup>
			</div>
		);
	}
}

CollectionMetadataForm.propTypes = propTypes;

export default CollectionMetadataForm;
