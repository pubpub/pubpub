import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PubEdge } from 'components';
import { RelationType } from 'utils/pubEdge';

import NewEdgeInput from './NewEdgeInput';

const propTypes = {
	availablePubs: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			avatar: PropTypes.string,
		}),
	).isRequired,
	usedPubIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const createCandidateEdge = (resource, relationType = RelationType.REPLY) => {
	return {
		relationType: relationType,
		pubIsParent: true,
		...resource,
	};
};

const NewEdgeEditor = (props) => {
	const { availablePubs, usedPubIds } = props;
	const [newEdge, setNewEdge] = useState(null);

	const handlePubSelect = (targetPub) => {
		setNewEdge(createCandidateEdge({ targetPub: targetPub }));
	};

	const renderNewEdgeControls = () => {
		return <PubEdge pubEdge={newEdge} />;
	};

	const renderInputControl = () => {
		return (
			<NewEdgeInput
				availablePubs={availablePubs}
				usedPubIds={usedPubIds}
				onSelectPub={handlePubSelect}
			/>
		);
	};

	return newEdge ? renderNewEdgeControls() : renderInputControl();
};

NewEdgeEditor.propTypes = propTypes;
export default NewEdgeEditor;
