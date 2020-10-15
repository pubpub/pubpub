import React from 'react';
import classNames from 'classnames';

require('./settingsSection.scss');

type Props = {
	className?: string;
	children: React.ReactNode;
	title: React.ReactNode;
};

const SettingsSection = (props: Props) => {
	const { title, className, children } = props;
	return (
		<div className={classNames('settings-section-component', className)}>
			<div className="title">{title}</div>
			<div className="content">{children}</div>
		</div>
	);
};

export default SettingsSection;
