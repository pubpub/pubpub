import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Callout } from '@blueprintjs/core';

import { PubEdgeListingCard } from 'components';
import { MenuButton, MenuItem } from 'components/Menu';
import { apiFetch } from 'client/utils/apiFetch';
import { usePendingChanges } from 'utils/hooks';
import { RelationType, relationTypeDefinitions } from 'utils/pubEdge';

import NewEdgeInput from './NewEdgeInput';

require('./newEdgeEditor.scss');

const propTypes = {
	availablePubs: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			avatar: PropTypes.string,
		}),
	).isRequired,
	onCreateNewEdge: PropTypes.func.isRequired,
	pubData: PropTypes.shape({
		title: PropTypes.string,
		id: PropTypes.string,
	}).isRequired,
	usedPubIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const createCandidateEdge = (resource, relationType = RelationType.Reply) => {
	return {
		relationType: relationType,
		pubIsParent: true,
		...resource,
	};
};

const NewEdgeEditor = (props) => {
	const { availablePubs, onCreateNewEdge, pubData, usedPubIds } = props;
	const [newEdge, setNewEdge] = useState(null);
	const [isCreatingEdge, setIsCreatingEdge] = useState(false);
	const [errorCreatingEdge, setErrorCreatingEdge] = useState(null);
	const { pendingPromise } = usePendingChanges();
	const currentRelationName =
		newEdge &&
		relationTypeDefinitions[newEdge.relationType] &&
		relationTypeDefinitions[newEdge.relationType].name;

	const handleSelectItem = (item) => {
		const { type, pub } = item;
		if (type === 'pub') {
			setNewEdge(createCandidateEdge({ targetPub: pub, targetPubId: pub.id }));
		}
	};

	const handleEdgeDirectionSwitch = () => {
		setNewEdge({
			...newEdge,
			pubIsParent: !newEdge.pubIsParent,
		});
	};

	const handleEdgeRelationTypeChange = (relationType) => {
		setNewEdge({
			...newEdge,
			relationType: relationType,
		});
	};

	const handleCreateEdge = () => {
		setIsCreatingEdge(true);
		setErrorCreatingEdge(null);
		pendingPromise(
			apiFetch.post('/api/pubEdges', {
				...newEdge,
				pubId: pubData.id,
				// Don't send the whole Pub, just the ID
				targetPub: undefined,
			}),
		)
			.then((createdEdge) => {
				onCreateNewEdge(createdEdge);
				setIsCreatingEdge(false);
				setNewEdge(null);
			})
			.catch((err) => {
				setIsCreatingEdge(false);
				setErrorCreatingEdge(err);
			});
	};

	const renderNewEdgeControls = () => {
		return (
			<div className="new-edge-controls">
				<PubEdgeListingCard pubEdge={newEdge} pubTitle={pubData.title} />
				{errorCreatingEdge && (
					<Callout intent="warning" className="error-callout">
						There was an error creating this Pub connection.
					</Callout>
				)}
				<div className="controls-row">
					<Button onClick={() => setNewEdge(null)}>Cancel</Button>
					<Button icon="swap-vertical" onClick={handleEdgeDirectionSwitch}>
						Switch direction
					</Button>
					<MenuButton
						aria-label="Select relationship type"
						buttonProps={{
							rightIcon: 'chevron-down',
							children: currentRelationName,
						}}
					>
						{Object.entries(relationTypeDefinitions).map(
							([relationType, definition]) => {
								const { name } = definition;
								const selected = newEdge.relationType === relationType;
								return (
									<MenuItem
										text={name}
										onClick={() => handleEdgeRelationTypeChange(relationType)}
										key={relationType}
										icon={selected ? 'tick' : 'blank'}
									/>
								);
							},
						)}
					</MenuButton>
					<Button intent="primary" onClick={handleCreateEdge} loading={isCreatingEdge}>
						Create
					</Button>
				</div>
			</div>
		);
	};

	const renderInputControl = () => {
		return (
			<NewEdgeInput
				availablePubs={availablePubs}
				usedPubIds={usedPubIds}
				onSelectItem={handleSelectItem}
			/>
		);
	};

	return (
		<div className={classNames('new-edge-editor-component', newEdge && 'has-new-edge')}>
			{newEdge ? renderNewEdgeControls() : renderInputControl()}
		</div>
	);
};

NewEdgeEditor.propTypes = propTypes;
export default NewEdgeEditor;
