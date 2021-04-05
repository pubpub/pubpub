import React from 'react';
import TimeAgo from 'react-timeago';

import { DefinitelyHas, Pub as BasePub } from 'utils/types';
import { formatDate, timeAgoBaseProps } from 'utils/dates';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { PubByline } from 'components';

import { getDashUrl } from 'utils/dashboard';
import OverviewRowSkeleton from './OverviewRowSkeleton';

type Pub = DefinitelyHas<BasePub, 'attributions'>;

type Props = {
	pub: Pub;
};

const pageLoadTimeMs = Date.now();
const maxTimeagoPeriod = 1000 * 86400 * 7; // one week

const getDateLabel = (date: Date) => {
	if (pageLoadTimeMs - date.valueOf() > maxTimeagoPeriod) {
		return `on ${formatDate(date)}`;
	}
	return <TimeAgo {...timeAgoBaseProps} live={false} date={date} />;
};

const getReleasedStateLabel = (pub: Pub) => {
	const publishedDate = getPubPublishedDate(pub);
	if (publishedDate) {
		return {
			label: <>Published&nbsp;{getDateLabel(publishedDate)}</>,
			icon: 'globe' as const,
		};
	}
	return {
		label: 'Unreleased',
		icon: 'lock2' as const,
	};
};

const PubOverviewRow = (props: Props) => {
	const { pub } = props;
	return (
		<OverviewRowSkeleton
			className="pub-overview-row-component"
			href={getDashUrl({ pubSlug: pub.slug })}
			title={pub.title}
			byline={<PubByline pubData={pub} linkToUsers={false} truncateAt={8} />}
			iconLabelPairs={[getReleasedStateLabel(pub)]}
			leftIcon="pubDoc"
		/>
	);
};

export default PubOverviewRow;
