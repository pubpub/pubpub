import React, { useState, useEffect } from 'react';
import sanitizeHTML from 'sanitize-html';
import { useDebounce } from 'use-debounce';
import { MenuItem, Spinner } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { apiFetch } from 'client/utils/apiFetch';

require('./citationLabel.scss');

type Props = {
	onSelectCitation: (...args: any[]) => any;
};

const fetchCitations = (query: string, style: string) =>
	apiFetch(`/api/citations/zotero?q=${query}&include=bib,citation,data&style=${style}`);

type ZoteroCSLJSON = {
	structured: string;
	key: string;
	citation: string;
};

const CitationBuilder = (props: Props) => {
	const [zoteroQuery, setZoteroQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedZoteroQuery] = useDebounce(zoteroQuery, 300);
	const [zoteroCitations, setZoteroCitations] = useState<ZoteroCSLJSON[]>([]);

	const renderItem = (itemProps: ZoteroCSLJSON) => {
		const __html = sanitizeHTML(itemProps.citation, { allowedTags: ['span'] });
		const itemLabel = <div className="citation-label" dangerouslySetInnerHTML={{ __html }} />;
		return (
			<MenuItem
				key={itemProps.key}
				text={itemLabel}
				onClick={() => props.onSelectCitation(itemProps)}
			/>
		);
	};

	useEffect(
		() => {
			if (debouncedZoteroQuery) {
				setIsLoading(true);
				fetchCitations(debouncedZoteroQuery, 'apa').then(({ items }) => {
					setIsLoading(false);
					setZoteroCitations(items);
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
			items={zoteroCitations.slice(0, 10)}
			inputProps={{ placeholder: 'Search your zotero library', large: true }}
			itemRenderer={renderItem}
			closeOnSelect={false}
			resetOnSelect={false}
			inputValueRenderer={() => 'string'}
			popoverProps={{ minimal: true }}
			fill
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
