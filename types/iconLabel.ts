import React from 'react';
import { IconName } from 'client/components';

export type IconLabelPair = {
	icon: IconName;
	label: string | React.ReactNode;
	iconSize?: number;
};
