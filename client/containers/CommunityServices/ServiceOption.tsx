import { ButtonGroup, Button } from '@blueprintjs/core';
import React, { useState } from 'react';

require('./serviceOption.scss');

type Props = {
	title: string;
	options: string[];
	prices: string[];
	initOption: number;
	description: string;
	setVal: any;
};

const ServiceOption = ({ title, options, prices, initOption, description, setVal }: Props) => {
	const [option, setOption] = useState(initOption);
	return (
		<div className="service-option">
			<div className="option-title">{title}</div>
			<div className="option-row">
				<ButtonGroup>
					{options.map((opt, index) => {
						return (
							<Button
								key={opt}
								text={opt}
								active={option === index}
								onClick={() => {
									setOption(index);
									setVal({ [title]: opt });
								}}
							/>
						);
					})}
				</ButtonGroup>
				<div className="option-price">{prices[option]}</div>
			</div>
			<div className="option-description">{description}</div>
		</div>
	);
};

export default ServiceOption;
