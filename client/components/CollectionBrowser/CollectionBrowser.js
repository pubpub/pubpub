import React, { useState, useContext } from 'react';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
	AnchorButton,
	Button,
	ButtonGroup,
	Menu,
	MenuItem,
	Popover,
	Position,
} from '@blueprintjs/core';

import { apiFetch } from 'utils';
import collectionType from 'types/collection';
import { pubDataProps } from 'types/pub';
import { pubUrl } from 'shared/utils/canonicalUrls';
import { getSchemaForKind } from 'shared/collections/schemas';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import PubPreviewImage from 'components/PubPreview/PubPreviewImage';

require('./collectionBrowser.scss');

const propTypes = {
	className: PropTypes.string,
	collection: collectionType.isRequired,
	currentPub: pubDataProps.isRequired,
};

const defaultProps = {
	className: '',
};

const CollectionBrowser = (props) => {
	const { className, collection, currentPub } = props;
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [pubs, setPubs] = useState(collection.pubs);
	const { communityData } = useContext(PageContext);
	const { bpDisplayIcon } = getSchemaForKind(collection.kind);
	useEffectOnce(() => {
		if (Array.isArray(collection.pubs)) {
			setIsLoading(false);
		}
		apiFetch(
			'/api/collectionPubs?' +
				queryString.stringify({
					collectionId: collection.id,
				}),
		)
			.then((res) => {
				setPubs(res);
				setIsLoading(false);
			})
			.catch((err) => {
				setError(err);
				setIsLoading(false);
			});
	});

	if (error) {
		return null;
	}

	const currentIndex = pubs && pubs.indexOf(pubs.find((p) => p.id === currentPub.id));
	const previousPub = pubs && currentIndex > 0 && pubs[currentIndex - 1];
	const nextPub = pubs && currentIndex !== pubs.length - 1 && pubs[currentIndex + 1];

	return (
		<div className="collection-browser-component">
			<ButtonGroup className={className}>
				<AnchorButton
					disabled={!previousPub}
					href={previousPub && pubUrl(communityData, previousPub)}
					icon="arrow-left"
				/>
				<Popover
					minimal
					position={Position.TOP_LEFT}
					modifiers={{ preventOverflow: { enabled: false }, hide: { enabled: false } }}
					content={
						<Menu className="collection-browser-component_menu">
							{pubs &&
								pubs.map((pub) => (
									<MenuItem
										href={pubUrl(communityData, pub)}
										textClassName="menu-item-text"
										icon={
											<PubPreviewImage
												className="pub-preview"
												pubData={pub}
												fitIn={100}
											/>
										}
										key={pub.id}
										text={pub.title}
									/>
								))}
						</Menu>
					}
				>
					<Button loading={isLoading} icon={bpDisplayIcon}>
						{collection.title}
					</Button>
				</Popover>
				<AnchorButton
					disabled={!nextPub}
					href={nextPub && pubUrl(communityData, nextPub)}
					icon="arrow-right"
				/>
			</ButtonGroup>
		</div>
	);
};

CollectionBrowser.propTypes = propTypes;
CollectionBrowser.defaultProps = defaultProps;
export default CollectionBrowser;
