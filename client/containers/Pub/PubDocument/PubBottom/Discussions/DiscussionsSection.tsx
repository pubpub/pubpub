import React, { useState } from 'react';
import { Popover, Position } from '@blueprintjs/core';

import { usePageContext } from 'utils/hooks';

import PubDiscussions from '../../PubDiscussions/PubDiscussions';
import PubBottomSection, { SectionBullets, AccentedIconButton } from '../PubBottomSection';
import SortList from './SortList';
import FilterMenu from './FilterMenu';
import { filterAndSortDiscussions } from '../../PubDiscussions/discussionUtils';

type Props = {
	pubData: {
		discussions?: {}[];
		labels?: {}[];
		canManage?: boolean;
	};
	updateLocalData: (...args: any[]) => any;
	sideContentRef: any;
	mainContentRef: any;
};

const DiscussionsSection = (props: Props) => {
	const { pubData, updateLocalData, sideContentRef, mainContentRef } = props;
	const { discussions } = pubData;
	const { communityData, scopeData } = usePageContext();
	const { canView, canManage, canCreateDiscussions } = scopeData.activePermissions;
	const [isBrowsingArchive, setIsBrowsingArchive] = useState(false);
	const [isShowingAnchoredComments, setShowingAnchoredComments] = useState(true);
	const [sortMode, setSortMode] = useState('newestThread');
	const [filteredLabels, setFilteredLabels] = useState<string[]>([]);

	// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
	const nonClosedDiscussions = discussions.filter((ds) => !ds.isClosed);

	// @ts-expect-error ts-migrate(2786) FIXME: 'SectionBullets' cannot be used as a JSX component... Remove this comment to see the full error message
	const renderCenterItems = () => <SectionBullets>{nonClosedDiscussions.length}</SectionBullets>;

	// eslint-disable-next-line react/prop-types
	const renderIconItems = ({ isExpanded, iconColor }) => {
		if (isExpanded) {
			return (
				<React.Fragment>
					<Popover
						minimal
						content={
							<SortList
								selected={sortMode}
								onSelect={(mode) => {
									setSortMode(mode);
								}}
							/>
						}
						position={Position.BOTTOM_RIGHT}
						transitionDuration={-1}
					>
						<AccentedIconButton
							accentColor={iconColor}
							icon="sort"
							title="Sort comments"
						/>
					</Popover>
					<Popover
						minimal
						content={
							<FilterMenu
								pubData={pubData}
								communityData={communityData}
								labelsData={pubData.labels || []}
								selectedLabels={filteredLabels}
								isManager={canManage}
								onBrowseArchive={setIsBrowsingArchive}
								isBrowsingArchive={isBrowsingArchive}
								onShowAnchoredComments={setShowingAnchoredComments}
								isShowingAnchoredComments={isShowingAnchoredComments}
								onLabelSelect={(labelId) => {
									const newFilteredLabels =
										filteredLabels.indexOf(labelId) > -1
											? filteredLabels.filter((id) => {
													return id !== labelId;
											  })
											: [...filteredLabels, labelId];
									setFilteredLabels(newFilteredLabels);
								}}
								updateLocalData={updateLocalData}
							/>
						}
						transitionDuration={-1}
						position={Position.BOTTOM_RIGHT}
						// @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; minimal: true; content:... Remove this comment to see the full error message
						close
					>
						<AccentedIconButton
							accentColor={iconColor}
							icon="filter"
							title="Filter comments"
						/>
					</Popover>
				</React.Fragment>
			);
		}
		return null;
	};

	const createDiscussionFilter = (searchTerm) => (threads) => {
		const res = filterAndSortDiscussions(
			threads,
			isBrowsingArchive,
			sortMode,
			filteredLabels,
			searchTerm,
			isShowingAnchoredComments,
		);
		return res;
	};

	return (
		<PubBottomSection
			accentColor={communityData.accentColorDark}
			isSearchable={true}
			title="Comments"
			// @ts-expect-error ts-migrate(2322) FIXME: Type '() => JSX.Element' is not assignable to type... Remove this comment to see the full error message
			centerItems={renderCenterItems}
			// @ts-expect-error ts-migrate(2322) FIXME: Type '({ isExpanded, iconColor }: { isExpanded: an... Remove this comment to see the full error message
			iconItems={renderIconItems}
			defaultExpanded={true}
			searchPlaceholder="Search comments..."
		>
			{({ searchTerm, isSearching }) => (
				<PubDiscussions
					// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
					sideContentRef={sideContentRef}
					// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
					mainContentRef={mainContentRef}
					pubData={pubData}
					// @ts-expect-error ts-migrate(2322) FIXME: Type '(threads: any) => any' is not assignable to ... Remove this comment to see the full error message
					filterDiscussions={createDiscussionFilter(searchTerm)}
					// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
					searchTerm={searchTerm}
					// @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
					showBottomInput={
						(canView || canCreateDiscussions) && !isSearching && !isBrowsingArchive
					}
				/>
			)}
		</PubBottomSection>
	);
};
export default DiscussionsSection;
