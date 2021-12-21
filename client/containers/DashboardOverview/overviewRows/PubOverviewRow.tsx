import React from 'react';
import classNames from 'classnames';
import { AnchorButton } from '@blueprintjs/core';

import { PubByline, Icon } from 'components';
import { DefinitelyHas, Pub as BasePub, IconLabelPair } from 'types';
import { pubUrl } from 'utils/canonicalUrls';
import { getDashUrl } from 'utils/dashboard';
import { usePageContext } from 'utils/hooks';

import OverviewRowSkeleton from './OverviewRowSkeleton';
import {
	getPubReleasedStateLabel,
	getScopeSummaryLabels,
	getSubmissionStatusLabel,
	getSubmissionTimeLabel,
} from './labels';

type Pub = DefinitelyHas<BasePub, 'attributions'>;

type Props = {
	leftIconElement?: React.ReactNode;
	rightElement?: React.ReactNode;
	className?: string;
	pub: Pub;
	inCollection?: boolean;
	isSubmission?: boolean;
};

const labelPairs = (iconLabelPairs: IconLabelPair[]) => {
	return (
		<div className="summary-icons">
			{iconLabelPairs.map((iconLabelPair, index) => {
				const {
					icon,
					label,
					iconSize: iconLabelPairIconSize = 12,
					intent = 'none',
				} = iconLabelPair;
				const iconElement =
					typeof icon === 'string' ? (
						<Icon icon={icon} iconSize={iconLabelPairIconSize} intent={intent} />
					) : (
						icon
					);
				return (
					<div
						className="summary-icon-pair"
						// eslint-disable-next-line react/no-array-index-key
						key={index}
					>
						{iconElement}
						{label}
					</div>
				);
			})}
		</div>
	);
};

const PubOverviewRow = (props: Props) => {
	const {
		pub,
		className,
		inCollection,
		isSubmission,
		leftIconElement = null,
		rightElement: providedRightElement,
	} = props;
	const { communityData } = usePageContext();
	const rightElement = providedRightElement || (
		<AnchorButton
			minimal
			icon="circle-arrow-right"
			href={pubUrl(communityData, pub)}
			target="_blank"
		/>
	);

	// for when a pub has a submission but is being rendered in collection or community overview
	if (pub.submission) {
		const { status } = pub.submission;
		const iconLabelPairs = isSubmission
			? labelPairs([getSubmissionStatusLabel(status), getSubmissionTimeLabel(pub)])
			: labelPairs([
					...getScopeSummaryLabels(pub.scopeSummary),
					getPubReleasedStateLabel(pub),
			  ]);
		return (
			<OverviewRowSkeleton
				className={classNames('pub-overview-row-component', className)}
				href={getDashUrl({ pubSlug: pub.slug })}
				title={pub.title}
				byline={<PubByline pubData={pub} linkToUsers={false} truncateAt={8} />}
				iconLabelPairs={iconLabelPairs}
				leftIcon={leftIconElement || 'pubDoc'}
				rightElement={rightElement}
				darkenRightIcons={inCollection}
			/>
		);
	}

	return (
		<OverviewRowSkeleton
			className={classNames('pub-overview-row-component', className)}
			href={getDashUrl({ pubSlug: pub.slug })}
			title={pub.title}
			byline={<PubByline pubData={pub} linkToUsers={false} truncateAt={8} />}
			iconLabelPairs={labelPairs([
				...getScopeSummaryLabels(pub.scopeSummary),
				getPubReleasedStateLabel(pub),
			])}
			leftIcon={leftIconElement || 'pubDoc'}
			rightElement={rightElement}
			darkenRightIcons={inCollection}
		/>
	);
};

export default PubOverviewRow;
