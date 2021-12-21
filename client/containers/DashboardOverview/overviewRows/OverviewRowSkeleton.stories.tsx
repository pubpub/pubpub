import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Icon } from '@blueprintjs/core';

import { IconLabelPair } from 'types';
import { Icon as LabelIcon } from 'components';

import OverviewRowSkeleton from './OverviewRowSkeleton';

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
						<LabelIcon icon={icon} iconSize={iconLabelPairIconSize} intent={intent} />
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

const iconLabelPairs = labelPairs([
	{ icon: 'globe', label: 'Published 12 days ago' },
	{ icon: 'chat', label: '65' },
]);

storiesOf('containers/DashboardOverview/OverviewRowSkeleton', module).add('default', () => (
	<OverviewRowSkeleton
		title="Machine Learning with Statistical Imputation for Predicting Drug Approvals"
		byline={<div>by Andrew W. Lo, Kien Wei Siah, and Chi Heem Wong</div>}
		href="#"
		leftIcon="pubDoc"
		iconLabelPairs={iconLabelPairs}
		rightElement={
			<Button icon={<Icon icon="circle-arrow-right" iconSize={20} />} minimal large />
		}
	/>
));
