import React, { useState } from 'react';
import { RadioGroup, Radio, Slider } from '@blueprintjs/core';

import { maxPubsPerBlock } from 'utils/layout';

type Props = {
	limit?: number;
	onChangeLimit: (nextLimit: undefined | number) => unknown;
};

const defaultCustomLimit = 10;
const maxCustomLimit = 30;

const LimitPubs = (props: Props) => {
	const { limit, onChangeLimit } = props;
	const [intermediateLimit, setIntermediateLimit] = useState(limit);

	const handleRadioSelect = (value: string) => {
		if (value === 'all') {
			onChangeLimit(undefined);
		} else {
			onChangeLimit(defaultCustomLimit);
			setIntermediateLimit(defaultCustomLimit);
		}
	};

	return (
		<div className="layout-editor-pubs_limit-pubs-component">
			<RadioGroup
				onChange={(evt) => handleRadioSelect(evt.currentTarget.value)}
				selectedValue={limit ? 'limit' : 'all'}
			>
				<Radio value="all" label={`Show up to ${maxPubsPerBlock} Pubs`} />
				<Radio
					value="limit"
					labelElement={
						<>
							Limit shown Pubs
							{!!limit && (
								<Slider
									className="limit-slider"
									min={1}
									max={maxCustomLimit}
									onChange={setIntermediateLimit}
									value={intermediateLimit}
									labelStepSize={maxCustomLimit - 1}
									onRelease={() => onChangeLimit(intermediateLimit!)}
								/>
							)}
						</>
					}
				/>
			</RadioGroup>
		</div>
	);
};

export default LimitPubs;
