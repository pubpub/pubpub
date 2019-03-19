/**
 * The inner bits 'n' pieces of the form that lets you edit structured collection metadata, i.e. to create
 * a collection that represents a structured collection of content like a journal issue or book.
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, NonIdealState } from '@blueprintjs/core';

import collectionType from 'types/collection';

import { enumerateMetadataFields, normalizeMetadataToKind } from 'shared/collections/metadata';
import { getSchemaForKind } from 'shared/collections/schemas';

require('./collectionMetadataEditor.scss');

const propTypes = {
	collection: collectionType.isRequired,
	communityData: PropTypes.shape({}).isRequired,
	onUpdateMetadata: PropTypes.func.isRequired,
};

class CollectionMetadataEditor extends React.Component {
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
		this.handleInputChange = this.handleInputChange.bind(this);
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

	renderField(field) {
		const { name, value, derived } = field;
		return (
			<InputGroup
				className="field"
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
		return <div className="component-collection-metadata-editor">{this.renderFields()}</div>;
	}
}

CollectionMetadataEditor.propTypes = propTypes;

export default CollectionMetadataEditor;
