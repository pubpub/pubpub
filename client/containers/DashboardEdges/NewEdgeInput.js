import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MenuItem, Position } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import isUrl from 'is-url';

import { PubMenuItem } from 'components';
import { apiFetch } from 'client/utils/apiFetch';
import { useThrottled } from 'utils/hooks';
import { fuzzyMatchPub } from 'utils/fuzzyMatch';

require('./newEdgeInput.scss');

const propTypes = {
	availablePubs: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			avatar: PropTypes.string,
		}),
	).isRequired,
	onSelectPub: PropTypes.func.isRequired,
	usedPubIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
const defaultProps = {};

const renderInputValue = () => '';

const NewEdgeInput = (props) => {
	const { availablePubs, usedPubIds, onSelectPub } = props;
	const [queryValue, setQueryValue] = useState('');
	const queryCountRef = useRef(-1);
	const [suggestedPubs, setSuggestedPubs] = useState([]);
	const throttledQueryValue = useThrottled(queryValue, 250, true, true);

	useEffect(() => {
		if (isUrl(queryValue)) {
			setSuggestedPubs([]);
		} else if (queryValue) {
			setSuggestedPubs(
				availablePubs
					.filter((pub) => fuzzyMatchPub(pub, queryValue) && !usedPubIds.includes(pub.id))
					.slice(0, 5),
			);
		} else {
			setSuggestedPubs([]);
		}
	}, [availablePubs, queryValue, throttledQueryValue, usedPubIds]);

	const renderPub = (pub, { handleClick, modifiers }) => {
		return (
			<PubMenuItem
				pubData={pub}
				active={modifiers.active}
				onClick={handleClick}
				showImage={true}
			/>
		);
	};

	return (
		<Suggest
			className="new-edge-input-component"
			items={suggestedPubs}
			inputProps={{
				large: true,
				placeholder: 'Search for Pubs in this Community, or enter a URL',
			}}
			inputValueRenderer={renderInputValue}
			onQueryChange={(query) => setQueryValue(query.trim())}
			itemRenderer={renderPub}
			resetOnSelect={true}
			onItemSelect={onSelectPub}
			noResults={queryValue ? <MenuItem disabled text="No results" /> : null}
			popoverProps={{
				wrapperTagName: 'div',
				minimal: true,
				position: Position.BOTTOM_LEFT,
				modifiers: {
					preventOverflow: { enabled: false },
					hide: { enabled: false },
				},
				usePortal: false,
			}}
		/>
	);
};

NewEdgeInput.propTypes = propTypes;
NewEdgeInput.defaultProps = defaultProps;
export default NewEdgeInput;
