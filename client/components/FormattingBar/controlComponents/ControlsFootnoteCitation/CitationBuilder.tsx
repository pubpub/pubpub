import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { MenuItem, Spinner } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { apiFetch } from 'client/utils/apiFetch';

type Props = {
	onSelectCitation: (...args: any[]) => any;
};

const fetchCitations = (query) => apiFetch(`/api/citations/zotero?q=${query}`);

type ZoteroCSLJSON = {
	key: string;
	data: {
		DOI: string;
		date: string;
		key: string;
		title: string;
	};
	meta: {
		creatorSummary: string;
	};
};

const CitationBuilder = (props: Props) => {
	const [zoteroQuery, setZoteroQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedZoteroQuery] = useDebounce(zoteroQuery, 300);
	const [zoteroCitations, setZoteroCitations] = useState<any[]>([]);

	const renderItem = (itemProps: ZoteroCSLJSON) => {
		return (
			<MenuItem
				key={itemProps.key}
				text={itemProps.data.DOI || itemProps.meta.creatorSummary}
				onClick={props.onSelectCitation}
			/>
		);
	};

	useEffect(
		() => {
			if (debouncedZoteroQuery) {
				setIsLoading(true);
				fetchCitations(debouncedZoteroQuery).then((results) => {
					setIsLoading(false);
					setZoteroCitations(results.items.raw);
				});
			} else {
				setZoteroCitations([]);
				setIsLoading(false);
			}
		},
		[debouncedZoteroQuery], // Only call effect if debounced search term changes
	);
	return (
		<Suggest
			query={zoteroQuery}
			onQueryChange={setZoteroQuery}
			items={zoteroCitations}
			inputProps={{ placeholder: 'Search your zotero library', large: true }}
			itemRenderer={renderItem}
			noResults={
				zoteroQuery ? (
					<MenuItem
						disabled
						className="loading-menu-item"
						text={isLoading ? 'Loading...' : 'No results'}
						icon={isLoading && <Spinner size={16} />}
					/>
				) : null
			}
		/>
	);
};

export default CitationBuilder;
