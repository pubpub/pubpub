import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Classes, MenuItem, Spinner } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { apiFetch } from 'client/utils/apiFetch';

type Props = {
	onSelectCitation: (...args: any[]) => any;
};

const fetchCitations = (query) => {
	console.log({ query });
	return apiFetch(`/api/citations/zotero?q=${query}`);
};

const wrapUpdateAttrs = (updateAttrs, isFootnote) => {
	return (attrsUpdate) => {
		const { structuredValue, unstructuredValue, ...restValues } = attrsUpdate;
		const result = { ...restValues };
		if ('structuredValue' in attrsUpdate) {
			result[isFootnote ? 'structuredValue' : 'value'] = structuredValue;
		}
		if ('unstructuredValue' in attrsUpdate) {
			result[isFootnote ? 'value' : 'unstructuredValue'] = unstructuredValue;
		}
		return updateAttrs(result);
	};
};

type SuggestedCitationProps = {
	id: string;
};

const SuggestedCitation = (props: SuggestedCitationProps) => {
	return (
		<div key={props.id}>
			pickme!
		</div>
	);
}

const CitationBuilder = (props: Props) => {
	const [zoteroQuery, setZoteroQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedZoteroQuery] = useDebounce(zoteroQuery, 300);
	const [zoteroCitations, setZoteroCitations] = useState<any[]>([]);
	useEffect(
		() => {
			if (debouncedZoteroQuery) {
				setIsLoading(true);
				fetchCitations(debouncedZoteroQuery).then((results) => {
					setIsLoading(false);
					setZoteroCitations(results);
				});
			} else {
				setZoteroCitations([]);
				setIsLoading(false);
			}
		},
		[debouncedZoteroQuery], // Only call effect if debounced search term changes
	);
	return (
		<div className="Citation-suggestion">
			<input
				value={zoteroQuery}
				onChange={(e) => setZoteroQuery(e.target.value)}
				className={Classes.INPUT}
				placeholder="search your zotero library"
				type="search"
			/>
			<Suggest
				items={zoteroCitations}
				inputProps={{placeholder: 'Search zotero for citations', large: true}}
				onQueryChange={setZoteroQuery}
				itemRenderer={SuggestedCitation}
				resetOnSelect={true}
				onItemSelect={props.onSelectCitation}
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
		</div>
	);
};

export default CitationBuilder;
