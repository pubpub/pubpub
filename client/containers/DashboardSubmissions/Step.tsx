import React from 'react';
import classNames from 'classnames';

require('./step.scss');

type Props = {
	title: React.ReactNode;
	number: number;
	className: string;
	children: React.ReactNode;
};

const Step = (props: Props) => {
	const { title, number, children, className } = props;
	return (
		<div className={classNames('step-component', className)}>
			<h2>
				<span className="number">{number}</span>
				{title}
			</h2>
			{children}
		</div>
	);
};

export default Step;
