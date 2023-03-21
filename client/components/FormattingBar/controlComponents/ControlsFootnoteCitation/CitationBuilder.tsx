import React, { useState, useEffect } from 'react';
import sanitizeHTML from 'sanitize-html';
import { useDebounce } from 'use-debounce';
import { MenuItem, Spinner, AnchorButton } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

import { apiFetch } from 'client/utils/apiFetch';
import { ZoteroCSLJSON } from 'types';

require('./citationBuilder.scss');

type Props = {
	onSelectCitation: (...args: any[]) => any;
};

const fetchCitations = (query: string, style: string) =>
	apiFetch(`/api/citations/zotero?q=${query}&include=bib,citation,data&style=${style}`);

const CitationBuilder = (props: Props) => {
	const [zoteroQuery, setZoteroQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedZoteroQuery] = useDebounce(zoteroQuery, 300);
	const [zoteroCitations, setZoteroCitations] = useState<ZoteroCSLJSON[]>([]);
	const [hasZoteroIntegration, setHasZoteroIntegration] = useState(false);

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

	useEffect(() => {
		apiFetch('/api/zoteroIntegration').then((res) => {
			setHasZoteroIntegration(res.id);
		});
	}, []);

	useEffect(
		() => {
			if (hasZoteroIntegration) {
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
			}
		},
		[debouncedZoteroQuery, hasZoteroIntegration], // Only call effect if debounced search term changes
	);
	return (
		<div className="citation-builder-component">
			<Suggest
				disabled={!hasZoteroIntegration}
				query={zoteroQuery}
				onQueryChange={setZoteroQuery}
				items={zoteroCitations}
				inputProps={{
					placeholder: hasZoteroIntegration
						? 'Search your zotero library...'
						: 'No zotero integration',
					large: true,
				}}
				itemRenderer={renderItem}
				closeOnSelect={false}
				resetOnSelect={false}
				className="suggest-component"
				popoverProps={{
					minimal: true,
					popoverClassName: 'citation-select',
					usePortal: false,
					modifiers: {
						minWidth: {
							enabled: true,
							fn: (data) => {
								data.styles.width = `${data.offsets.reference.width}px`;
								return data;
							},
							order: 800,
						},
					},
				}}
				fill={hasZoteroIntegration}
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
			{!hasZoteroIntegration ? (
				<AnchorButton
					rightIcon="exchange"
					intent="primary"
					className="zotero-link-button"
					href="/legal/settings"
					text="Connect Zotero"
				/>
			) : null}
		</div>
	);
};

export default CitationBuilder;
