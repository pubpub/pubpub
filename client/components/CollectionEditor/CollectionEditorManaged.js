/**
 * A wrapper around CollectionEditor that understands how to translate user action into updated
 * collection state -- basically a bunch of handlers.
 */
import React from 'react';
import PropTypes from 'prop-types';

import collectionType from 'types/collection';
import pubType from 'types/pub';
import CollectionEditor from './CollectionEditor';

const propTypes = {
	collection: collectionType.isRequired,
	onUpdateSelections: PropTypes.func.isRequired,
	selections: PropTypes.arrayOf(
		PropTypes.shape({
			collection: collectionType.isRequired,
			pub: pubType.isRequired,
		}),
	).isRequired,
	pubs: PropTypes.arrayOf(pubType).isRequired,
};

class CollectionEditorManaged extends React.Component {
	constructor(props) {
		super(props);
		this.handleAddSelection = this.handleAddSelection.bind(this);
		this.handleRemoveSelectionByPub = this.handleRemoveSelectionByPub.bind(this);
		this.handleReorderSelections = this.handleReorderSelections.bind(this);
		this.handleSetSelectionContextHint = this.handleSetSelectionContextHint.bind(this);
	}

	updateSelections(fnOfSelections) {
		const { selections, onUpdateSelections } = this.props;
		onUpdateSelections(fnOfSelections(selections));
	}

	handleAddSelection(selection, index) {
		this.updateSelections((selections) => [
			...selections.slice(0, index),
			selection,
			...selections.slice(index),
		]);
	}

	handleRemoveSelectionByPub(pubToRemove) {
		this.updateSelections((selections) =>
			selections.filter((selection) => selection.pub !== pubToRemove),
		);
	}

	handleReorderSelections(sourceIndex, destinationIndex) {
		this.updateSelections((selections) => {
			const nextSelections = [...selections];
			const [removed] = nextSelections.splice(sourceIndex, 1);
			nextSelections.splice(destinationIndex, 0, removed);
			return nextSelections;
		});
	}

	handleSetSelectionContextHint(selection, contextHint) {
		this.updateSelections((selections) =>
			[...selections].map((s) => {
				if (s === selection) {
					return {
						...selection,
						contextHint: (contextHint.value && contextHint) || null,
					};
				}
				if (s.contextHint && s.contextHint.value === contextHint.value) {
					return {
						...s,
						contextHint: null,
					};
				}
				return s;
			}),
		);
	}

	render() {
		const { collection, pubs, selections } = this.props;
		return (
			<CollectionEditor
				pubs={pubs}
				selections={selections}
				collection={collection}
				onAddSelection={this.handleAddSelection}
				onRemoveSelectionByPub={this.handleRemoveSelectionByPub}
				onReorderSelections={this.handleReorderSelections}
				onSetSelectionContextHint={this.handleSetSelectionContextHint}
			/>
		);
	}
}

CollectionEditorManaged.propTypes = propTypes;
export default CollectionEditorManaged;
