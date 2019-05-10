import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Slider, Spinner } from '@blueprintjs/core';
import dateFormat from 'dateformat';

import { pubDataProps } from 'types/pub';

require('./history.scss');

const propTypes = {
	pubData: pubDataProps.isRequired,
};

const History = (props) => {
	const {
		pubData,
		historyData,
		collabData: { latestKey },
		updateLocalData,
	} = props;

	const [value, setValue] = useState(latestKey);

	const latestKeyNum = Number(latestKey);
	const isLoading = !latestKey;
	const nothingToShow = latestKey && latestKey <= 1;

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
		const timestamp = historyData.timestampsForHistoryKeys[step];
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
				<Slider
					min={1}
					max={latestKeyNum}
					stepSize={1}
					labelRenderer={renderLabel}
					labelStepSize={latestKeyNum - 1}
					value={value}
					onChange={setValue}
				/>
			)}
		</div>
	);
};

History.propTypes = propTypes;
export default History;
