import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@blueprintjs/core';
import CollectionMetadataForm from './CollectionMetadataForm';

require('./collectionMetadata.scss');

const propTypes = {
	children: PropTypes.func.isRequired,
	onUpdateMetadata: PropTypes.func.isRequired,
	collection: PropTypes.shape({ title: PropTypes.string.isRequired }).isRequired,
};

const CollectionMetadataDialog = (props) => {
	const { children, onUpdateMetadata, collection, ...restProps } = props;
	const { title } = collection;
	const [isOpen, setIsOpen] = useState();
	return (
		<React.Fragment>
			{children(() => setIsOpen(true))}
			<Dialog
				onClose={() => setIsOpen(false)}
				isOpen={isOpen}
				title={
					<span>
						Metadata for <em>{title}</em>
					</span>
				}
				className="collection-metadata-dialog"
				canOutsideClickClose={false}
				canEscapeKeyClose={false}
				lazy={true}
			>
				<CollectionMetadataForm
					{...restProps}
					collection={collection}
					onUpdateMetadata={(metadata) => {
						setIsOpen(false);
						onUpdateMetadata(metadata);
					}}
				/>
			</Dialog>
		</React.Fragment>
	);
};

CollectionMetadataDialog.propTypes = propTypes;

export default CollectionMetadataDialog;
