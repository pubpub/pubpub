import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'react-use';
import stickybits from 'stickybits';
import { Slider, Spinner } from '@blueprintjs/core';

import { pubDataProps } from 'types/pub';

require('./history.scss');

const propTypes = {
	pubData: pubDataProps.isRequired,
};

const calculateLabelStepSize = (max) => {
	const totalLabels = 10;
	// A power of ten that we want our results to end up near
	const snapToNearest = 10 ** (Math.floor(Math.log10(max)) - 1);
	return Math.floor(max / totalLabels / snapToNearest) * snapToNearest;
};

const History = (props) => {
	const {
		pubData,
		collabData: { latestKey },
		updateLocalData,
	} = props;

	const [value, setValue] = useState(latestKey);
	const stickyInstanceRef = useRef();

	useEffect(() => {
		if (!value && latestKey) {
			setValue(latestKey);
		}
	}, [latestKey, value]);

	useEffect(() => {
		stickyInstanceRef.current = stickybits('.pub-meta_history-component', {
			stickyBitStickyOffset: 35, useFixed: true,
		});
		return () => {
			if (stickyInstanceRef.current) {
				stickyInstanceRef.current.cleanup();
			}
		};
	});

	useDebounce(
		() => {
			updateLocalData('history', { historyKey: value });
		},
		100,
		[value],
	);

	return (
		<div className="pub-meta_history-component">
			{!latestKey && <Spinner size={25} />}
			{latestKey && (
				<Slider
					min={1}
					max={Number(latestKey)}
					stepSize={1}
					labelRenderer={(n) => (n === 0 ? 1 : n - 1).toString()}
					labelStepSize={calculateLabelStepSize(latestKey)}
					value={value}
					onChange={setValue}
				/>
			)}
		</div>
	);
};

History.propTypes = propTypes;
export default History;
