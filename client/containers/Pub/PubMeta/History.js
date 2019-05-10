import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'react-use';
import { Slider, Spinner } from '@blueprintjs/core';
import dateFormat from 'dateformat';

import { pubDataProps } from 'types/pub';
import { pubUrl } from 'shared/utils/canonicalUrls';
import ClickToCopyButton from 'components/ClickToCopyButton/ClickToCopyButton';
import { PageContext } from 'components/PageWrapper/PageWrapper';

require('./history.scss');

const propTypes = {
	collabData: PropTypes.shape({
		latestKey: PropTypes.string,
	}).isRequired,
	historyData: PropTypes.shape({
		timestampsForHistoryKeys: PropTypes.object,
	}).isRequired,
	pubData: pubDataProps.isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const History = (props) => {
	const {
		pubData,
		historyData: { timestampsForHistoryKeys },
		collabData: { latestKey },
		updateLocalData,
	} = props;

	const latestKeyNum = Number(latestKey);
	const isLoading = !latestKey;
	const nothingToShow = latestKey && latestKey <= 1;

	const [value, setValue] = useState(latestKey);
	const { communityData } = useContext(PageContext);

	useEffect(() => {
		if (!value && latestKey) {
			setValue(latestKey);
		}
	}, [latestKey, value]);

	useDebounce(
		() => {
			updateLocalData('history', { historyKey: value });
		},
		100,
		[value],
	);

	const renderLabel = (step) => {
		const labelDateFormat = (date, withTime) =>
			dateFormat(date, 'mmm dd, yyyy' + (withTime ? ' HH:MM' : ''));
		if (step === 1) {
			return labelDateFormat(pubData.createdAt);
		}
		if (step === latestKeyNum) {
			return labelDateFormat(Date.now());
		}
		const timestamp = timestampsForHistoryKeys[step];
		if (timestamp) {
			return labelDateFormat(timestamp, true);
		}
		return '...';
	};

	return (
		<div className="pub-meta_history-component">
			{isLoading && <Spinner size={25} />}
			{nothingToShow && 'This branch has no history (yet)'}
			{!isLoading && !nothingToShow && (
				<React.Fragment>
					<Slider
						min={1}
						max={latestKeyNum}
						stepSize={1}
						labelRenderer={renderLabel}
						labelStepSize={latestKeyNum - 1}
						value={value}
						onChange={setValue}
					/>
					<ClickToCopyButton
						className="click-to-copy"
						copyString={pubUrl(
							communityData,
							pubData,
							pubData.activeBranch.shortId,
							value.toString(),
						)}
						beforeCopyPrompt="Copy a link to this version"
					/>
				</React.Fragment>
			)}
		</div>
	);
};

History.propTypes = propTypes;
export default History;
