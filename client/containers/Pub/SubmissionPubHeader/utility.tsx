import React from 'react';
import { Icon, IconName } from '@blueprintjs/core';

export const renderInstructionTabTitle = (icon: IconName, title: string) => {
	return (
		<>
			<Icon icon={icon} /> {title}
		</>
	);
};
