import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { Spinner } from '@blueprintjs/core';

import { Icon } from 'components';

require('./overviewSearchGroup.scss');

type SearchTermCallback = (q: string) => unknown;

type Props = {
	isLoading?: boolean;
	placeholder: string;
	onUpdateSearchTerm?: SearchTermCallback;
	onCommitSearchTerm?: SearchTermCallback;
};

const OverviewSearchGroup = (props: Props) => {
	const { isLoading, placeholder, onCommitSearchTerm, onUpdateSearchTerm } = props;
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target as HTMLInputElement;
			if (onUpdateSearchTerm) {
				onUpdateSearchTerm(value);
			}
		},
		[onUpdateSearchTerm],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			const { value } = e.target as HTMLInputElement;
			if (e.key === 'Enter' && onCommitSearchTerm) {
				onCommitSearchTerm(value);
			}
		},
		[onCommitSearchTerm],
	);

	return (
		<div
			className={classNames(
				'overview-search-group-component',
				isSearchFocused && 'search-focused',
			)}
		>
			<div className="left-element">
				{!isLoading && <Icon icon="search" className="search-icon" iconSize={16} />}
				{isLoading && <Spinner size={18} />}
			</div>
			<input
				placeholder={placeholder}
				onFocus={() => setIsSearchFocused(true)}
				onBlur={() => setIsSearchFocused(false)}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};

export default OverviewSearchGroup;
