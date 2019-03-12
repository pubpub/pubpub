/**
 * Renders a dialog-wrapped verison of CollectionEditor that manages persistence.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ControlGroup, Dialog, Divider } from '@blueprintjs/core';

import collectionType from 'types/collection';
import pubType from 'types/pub';

import { loadPubSelections, persistPubSelections } from './api';
import CollectionEditorManaged from './CollectionEditorManaged';

const propTypes = {
	collection: collectionType.isRequired,
	pubs: PropTypes.arrayOf(pubType).isRequired,
	communityId: PropTypes.string.isRequired,
	children: PropTypes.func.isRequired,
};

class CollectionEditorDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSaving: false,
			isOpen: false,
			selections: null,
		};
		this.handleSaveClick = this.handleSaveClick.bind(this);
	}

	componentDidUpdate(_, lastState) {
		const { collection, communityId, pubs } = this.props;
		if (!lastState.isOpen && this.state.isOpen) {
			loadPubSelections(pubs, collection, communityId).then((selections) =>
				this.setState({ selections: selections }),
			);
		}
	}

	isLoading() {
		return !this.state.selections;
	}

	handleSaveClick() {
		const { communityId, collection, pubs } = this.props;
		const { selections } = this.state;
		this.setState({ isSaving: true });
		persistPubSelections(selections, pubs, collection, communityId).then((updatedSelections) =>
			this.setState({ selections: updatedSelections, isSaving: false, isOpen: false }),
		);
	}

	renderDialogContents() {
		const { collection, pubs } = this.props;
		const { isSaving, selections } = this.state;
		return (
			<React.Fragment>
				<CollectionEditorManaged
					collection={collection}
					pubs={pubs}
					selections={selections}
					onUpdateSelections={(newSelections) =>
						this.setState({ selections: newSelections })
					}
				/>
				<Divider />
				<ControlGroup className="bottom-buttons">
					<Button icon="tick" loading={isSaving} onClick={this.handleSaveClick}>
						Save and close
					</Button>
				</ControlGroup>
			</React.Fragment>
		);
	}

	render() {
		const { children, collection } = this.props;
		const { isOpen } = this.state;
		const isLoading = this.isLoading();
		return (
			<React.Fragment>
				{children(() => this.setState({ isOpen: true }), isOpen && isLoading)}
				{!isLoading && (
					<Dialog
						onClose={() => this.setState({ isOpen: false })}
						isOpen={isOpen}
						title={
							<span>
								Pubs in <em>{collection.title}</em>
							</span>
						}
						className="collection-editor-dialog"
						canOutsideClickClose={false}
						canEscapeKeyClose={false}
						lazy={true}
					>
						{this.renderDialogContents()}
					</Dialog>
				)}
			</React.Fragment>
		);
	}
}

CollectionEditorDialog.propTypes = propTypes;

export default CollectionEditorDialog;
